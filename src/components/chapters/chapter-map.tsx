/// <reference types="vite/client" />
import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import type { Map as MapLibreMap, Marker, Popup } from "maplibre-gl"
import type { Chapter } from "@/content/chapters"

/**
 * The chapter map: MapLibre GL with OpenFreeMap's free vector tiles (no key, attribution always shown). It's an
 * enhancement only: the chapter list beside it has every chapter and every detail, and works without it.
 *
 * MapLibre needs the browser (WebGL, window), so it's imported in an effect and never runs on the server.
 * Pins are real buttons, in list order. Choosing a pin or a list item opens a popup; moving the map never animates
 * when the person asks for reduced motion.
 */
const STYLE = {
  light: "https://tiles.openfreemap.org/styles/positron",
  dark: "https://tiles.openfreemap.org/styles/dark",
}

const darkQuery = () => window.matchMedia("(prefers-color-scheme: dark)")
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

type Status = "loading" | "ready" | "unavailable"

export function ChapterMap({
  chapters,
  selected,
  focusPopup,
  onSelect,
  pinLabel,
  popup,
}: {
  chapters: Chapter[]
  selected: Chapter | null
  /** True when the selection came from a pin, so focus moves into the popup. False when it came from the list. */
  focusPopup: boolean
  onSelect: (id: string | null, from: "pin" | "map") => void
  pinLabel: (chapter: Chapter) => string
  /** The popup's content for the selected chapter. */
  popup: ReactNode
}) {
  const id = useId()
  const container = useRef<HTMLDivElement>(null)
  const map = useRef<MapLibreMap | null>(null)
  const lib = useRef<typeof import("maplibre-gl") | null>(null)
  const markers = useRef(new Map<string, Marker>())
  const popupRef = useRef<Popup | null>(null)
  const [popupNode] = useState(() => (typeof document === "undefined" ? null : document.createElement("div")))
  const [status, setStatus] = useState<Status>("loading")
  const latest = useRef({ onSelect })
  useEffect(() => {
    latest.current = { onSelect }
  })

  // Create the map once, in the browser.
  useEffect(() => {
    let cancelled = false
    const el = container.current
    const pins = markers.current
    if (!el) return
    // MapLibre looks for its worker next to its own file, which bundling moves. The build bundles the worker and
    // passes its URL; in dev, vite.config.ts serves MapLibre's own worker files.
    const worker = import.meta.env.PROD
      ? import("maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url").then((w) => w.default)
      : "/maplibre-gl-worker/maplibre-gl-worker.mjs"
    Promise.all([import("maplibre-gl"), worker, import("maplibre-gl/dist/maplibre-gl.css")])
      .then(([maplibre, workerUrl]) => {
        if (cancelled) return
        maplibre.setWorkerUrl(new URL(workerUrl, location.href).href)
        lib.current = maplibre
        const dark = darkQuery()
        const m = new maplibre.Map({
          container: el,
          style: dark.matches ? STYLE.dark : STYLE.light,
          center: [-60, 30],
          zoom: 1.4,
          minZoom: 1,
          maxZoom: 10,
          dragRotate: false,
          touchPitch: false,
          pitchWithRotate: false,
          // Scrolling the page never zooms the map by accident.
          cooperativeGestures: true,
          attributionControl: { compact: false },
          locale: { "Map.Title": "Chapter map. Arrow keys pan, plus and minus zoom." },
        })
        m.addControl(new maplibre.NavigationControl({ showCompass: false }), "top-right")
        // MapLibre disables a zoom button at the zoom limit, which drops keyboard focus to the page. Keep them focusable.
        const keepZoomFocusable = () =>
          el.querySelectorAll<HTMLButtonElement>(".maplibregl-ctrl-group button").forEach((b) => {
            b.setAttribute("aria-disabled", String(b.disabled))
            b.disabled = false
          })
        keepZoomFocusable()
        m.on("zoom", keepZoomFocusable)
        m.on("load", () => !cancelled && setStatus("ready"))
        // The style or tiles can't be reached before the map is ready: say so, and leave the list to do the work.
        m.on("error", () => !cancelled && !m.loaded() && setStatus("unavailable"))
        // Focusing a pin outside the view scrolls the map's clipped box; keep it put and bring the pin into view instead.
        el.addEventListener("scroll", () => el.scrollTo(0, 0))
        const onScheme = () => m.setStyle(dark.matches ? STYLE.dark : STYLE.light)
        dark.addEventListener("change", onScheme)
        map.current = m
        m.once("remove", () => dark.removeEventListener("change", onScheme))
      })
      .catch(() => !cancelled && setStatus("unavailable"))
    return () => {
      cancelled = true
      pins.clear()
      map.current?.remove()
      map.current = null
    }
  }, [])

  // One pin per chapter that passes the filters, in list order so Tab follows the list. Then fit them in view.
  useEffect(() => {
    const m = map.current
    const maplibre = lib.current
    if (!m || !maplibre || status === "unavailable") return
    for (const marker of markers.current.values()) marker.remove()
    markers.current.clear()
    for (const chapter of chapters) {
      const button = document.createElement("button")
      button.type = "button"
      button.className = "bgx-pin"
      button.setAttribute("aria-label", pinLabel(chapter))
      button.addEventListener("click", (e) => {
        e.stopPropagation()
        latest.current.onSelect(chapter.id, "pin")
      })
      button.addEventListener("focus", () => {
        if (!m.getBounds().contains([chapter.lon, chapter.lat])) m.jumpTo({ center: [chapter.lon, chapter.lat] })
      })
      markers.current.set(chapter.id, new maplibre.Marker({ element: button }).setLngLat([chapter.lon, chapter.lat]).addTo(m))
    }
    // Most chapters are in the Americas. Showing the whole world would pile their pins on top of each other, so the map
    // fits the Americas when any match, and other regions only when the filters leave just them.
    const americas = chapters.filter((c) => c.lon < -30)
    const inView = americas.length ? americas : chapters
    if (inView.length) {
      const bounds = new maplibre.LngLatBounds()
      for (const c of inView) bounds.extend([c.lon, c.lat])
      m.fitBounds(bounds, { padding: 56, maxZoom: 6, animate: !reducedMotion() })
    }
    // pinLabel changes with the events count; the pins are rebuilt when the list does.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters, status])

  // Show the selected pin and its popup. Move the map to it, without animation for reduced motion.
  useEffect(() => {
    const m = map.current
    const maplibre = lib.current
    if (!m || !maplibre || !popupNode) return
    for (const [chapterId, marker] of markers.current) {
      const pin = marker.getElement()
      pin.toggleAttribute("data-selected", chapterId === selected?.id)
      pin.setAttribute("aria-expanded", String(chapterId === selected?.id))
    }
    const open = popupRef.current
    popupRef.current = null
    open?.remove()
    if (!selected || !markers.current.has(selected.id)) return
    const target: [number, number] = [selected.lon, selected.lat]
    const zoom = Math.max(m.getZoom(), 4)
    // The pin sits low in the view, so its popup opens above it without leaving the map.
    const offset: [number, number] = [0, Math.min(140, m.getContainer().clientHeight / 4)]
    if (reducedMotion()) m.jumpTo({ center: target, zoom }).panBy([-offset[0], -offset[1]], { animate: false })
    else m.easeTo({ center: target, zoom, offset, duration: 600 })
    const pin = markers.current.get(selected.id)!.getElement()
    const p = new maplibre.Popup({ anchor: "bottom", offset: 22, maxWidth: "20rem", focusAfterOpen: focusPopup, closeOnClick: true, className: "bgx-popup" })
      .setLngLat(target)
      .setDOMContent(popupNode)
      .addTo(m)
    // Escape closes the popup and puts focus back on its pin.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      latest.current.onSelect(null, "map")
      pin.focus()
    }
    popupNode.addEventListener("keydown", onKey)
    p.on("close", () => {
      popupNode.removeEventListener("keydown", onKey)
      if (popupRef.current === p) {
        popupRef.current = null
        latest.current.onSelect(null, "map")
      }
    })
    popupRef.current = p
  }, [selected, focusPopup, popupNode, status, chapters])

  return (
    <section aria-labelledby={`${id}-title`} className="min-w-0 space-y-2">
      <h2 id={`${id}-title`} className="type-title-3">
        Map of chapters
      </h2>
      <p id={`${id}-help`} className="text-muted-foreground">
        Each pin is a button: press Tab to move between pins and Enter to open one. The map opens on the Americas; zoom out, or
        choose a region, to see chapters in Europe and Asia-Pacific. Every chapter is also in the list, with all its details.
      </p>
      <div className="relative">
        <div
          ref={container}
          aria-describedby={`${id}-help`}
          inert={status === "unavailable"}
          className="bgx-map h-[22rem] w-full overflow-hidden rounded-2xl border bg-surface-sunken sm:h-[28rem] xl:h-[34rem]"
        />
        {status !== "ready" && (
          <p role="status" className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center text-muted-foreground">
            {status === "loading" ? "Loading the map…" : "The map couldn't load in this browser. The chapter list has every chapter."}
          </p>
        )}
      </div>
      {popupNode && selected && createPortal(popup, popupNode)}
    </section>
  )
}
