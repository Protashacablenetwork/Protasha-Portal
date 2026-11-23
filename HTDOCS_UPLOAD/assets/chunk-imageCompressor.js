//#region src/utils/imageCompressor.ts
/**
* Compresses an image file client-side to a crisp, web-optimized JPEG data URL (~40-80KB).
* This ensures:
* 1. Fast uploads without payload limit errors.
* 2. Safe storage in safeStorage without hitting quota limits (which fail silently on 5MB+ files).
* 3. Bulletproof persistence across server restarts and Cloud Run container scale-downs.
*/
async function compressImage(file, maxWidth = 800, maxHeight = 800, quality = .82) {
	return new Promise((resolve, reject) => {
		if (!file.type.startsWith("image/")) {
			reject(/* @__PURE__ */ new Error("Invalid image file"));
			return;
		}
		const reader = new FileReader();
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Failed to read file"));
		reader.onload = (event) => {
			var _event$target2;
			const img = new Image();
			img.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load image"));
			img.onload = () => {
				let width = img.width;
				let height = img.height;
				if (width > height) {
					if (width > maxWidth) {
						height = Math.round(height * maxWidth / width);
						width = maxWidth;
					}
				} else if (height > maxHeight) {
					width = Math.round(width * maxHeight / height);
					height = maxHeight;
				}
				const canvas = document.createElement("canvas");
				canvas.width = width;
				canvas.height = height;
				const ctx = canvas.getContext("2d");
				if (!ctx) {
					var _event$target;
					resolve((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
					return;
				}
				ctx.fillStyle = "#FFFFFF";
				ctx.fillRect(0, 0, width, height);
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";
				ctx.drawImage(img, 0, 0, width, height);
				let q = quality;
				let dataUrl = canvas.toDataURL("image/jpeg", q);
				while (dataUrl.length > 45e4 && q > .35) {
					q -= .12;
					dataUrl = canvas.toDataURL("image/jpeg", q);
				}
				resolve(dataUrl);
			};
			img.src = (_event$target2 = event.target) === null || _event$target2 === void 0 ? void 0 : _event$target2.result;
		};
		reader.readAsDataURL(file);
	});
}
//#endregion
export { compressImage as t };
