import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { En as require_react } from "./chunk-vendor-icons.js";
//#region src/utils/useSubViewBack.ts
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Universal hardware/browser Back button hook for modals and full-screen pages with inner sub-views.
* - Pushes a history entry whenever `activeDepth` increases while `isOpen` is true.
* - Notifies parent via `onSubViewChange(activeDepth > 0)` so the parent modal stays open while
*   inner sub-views unwind step-by-step on device Back button presses.
* - Invokes `onPopTopSubView` in LIFO order on `popstate`.
*/
function useSubViewBack(isOpen, activeDepth, onPopTopSubView, onSubViewChange, tag = "subView") {
	const prevDepthRef = (0, import_react.useRef)(0);
	const popCallbackRef = (0, import_react.useRef)(onPopTopSubView);
	popCallbackRef.current = onPopTopSubView;
	const activeDepthRef = (0, import_react.useRef)(activeDepth);
	activeDepthRef.current = activeDepth;
	(0, import_react.useEffect)(() => {
		onSubViewChange === null || onSubViewChange === void 0 || onSubViewChange(isOpen && activeDepth > 0);
		return () => {
			onSubViewChange === null || onSubViewChange === void 0 || onSubViewChange(false);
		};
	}, [
		isOpen,
		activeDepth,
		onSubViewChange
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) {
			prevDepthRef.current = 0;
			return;
		}
		if (activeDepth > prevDepthRef.current) {
			const delta = activeDepth - prevDepthRef.current;
			for (let i = 0; i < delta; i++) try {
				window.history.pushState({
					appSubView: tag,
					depth: prevDepthRef.current + i + 1,
					time: Date.now()
				}, "");
			} catch {}
		}
		prevDepthRef.current = activeDepth;
	}, [
		isOpen,
		activeDepth,
		tag
	]);
	(0, import_react.useEffect)(() => {
		if (!isOpen) return;
		const handlePop = () => {
			if (activeDepthRef.current > 0) {
				prevDepthRef.current = Math.max(0, activeDepthRef.current - 1);
				popCallbackRef.current();
			}
		};
		window.addEventListener("popstate", handlePop);
		return () => window.removeEventListener("popstate", handlePop);
	}, [isOpen]);
}
//#endregion
export { useSubViewBack as t };
