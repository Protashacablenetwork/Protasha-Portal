import { r as __toESM } from "./chunk-rolldown-runtime.js";
import { At as FileText, En as require_react, Sn as ArrowLeft, an as ChartPie, cn as ChartColumn, d as Users, en as ChevronRight, fn as Calculator, jt as FileSpreadsheet, m as UserCheck, on as ChartNoAxesColumn, tn as ChevronLeft, un as Calendar, v as TrendingUp, y as TrendingDown, zt as Download } from "./chunk-vendor-icons.js";
import { r as require_react_dom, t as require_jsx_runtime } from "./chunk-vendor-react.js";
import { i as toBengaliNumber, t as formatCurrency } from "./chunk-formatters.js";
import { M as isSubAdmin, P as isTransactionOwner, tt as sounds } from "./app.js";
import { $ as selectChartHeight, A as useChartName, At as Layer, B as Curve, C as Shape, Ct as interpolate, D as Tooltip, Dt as isNumber, E as LabelListFromLabelProp, Et as isNullish, F as selectUnfilteredCartesianItems, Ft as svgPropertiesNoEventsFromUnknown, G as useCartesianChartLayout, H as setLegendSettings, I as getStackSeriesIdentifier, It as clsx, J as useChartWidth, K as useChartHeight, L as DefaultZIndexes, M as selectAxisWithScale, Mt as svgPropertiesAndEvents, N as selectStackGroups, Nt as svgPropertiesAndEventsFromUnknown, O as arrayTooltipSearcher, Ot as noop, P as selectTicksOfGraphicalItem, Pt as svgPropertiesNoEvents, Q as selectChartViewBox, R as selectChartBaseValue, S as SetTooltipEntrySettings, St as isOutsidePosition, T as CartesianLabelListContextProvider, Tt as isNotNil, U as setLegendSize, V as propsAreEqual, W as selectChartLayout, X as ResponsiveContainer, Y as useMargin, Z as useIsPanorama, _ as useAnimationCallbacks, _t as adaptEventsOfChild, a as Bar, at as getTooltipNameProp, b as matchByIndex, bt as useLegendPortal, c as GraphicalItemClipPath, ct as isWellBehavedNumber, d as useActiveTooltipDataPoints, dt as createSelector, et as selectChartWidth, f as usePlotArea, ft as useAppDispatch, g as AnimatedItems, gt as adaptEventHandlers, h as useId, ht as resolveDefaultProps, i as XAxis, it as getNormalizedStackId, j as selectActiveTooltipIndex, jt as Surface, k as ZIndexLayer, kt as upperFirst, l as useNeedsClip, lt as useElementOffset, m as RegisterGraphicalItemId, mt as getUniqPayload, n as CartesianChart, nt as getBandSizeOfAxis, o as selectXAxisIdFromGraphicalItemId, ot as getValueByDataKey, p as SetCartesianGraphicalItem, pt as useAppSelector, q as useChartLayout, r as YAxis, rt as getCateCoordinateOfLine, s as selectYAxisIdFromGraphicalItemId, st as isCategoricalAxis, t as BarChart, tt as selectMargin, u as CartesianGrid, ut as selectLegendPayload, v as useAnimationStartSnapshot, vt as withPath, w as isClipDot, wt as isNan, x as SetLegendPayload, xt as getCartesianPosition, y as matchAnimationItems, yt as constant_default, z as selectChartDataWithIndexesIfNotInPanoramaPosition3 } from "./chunk-BarChart.js";
//#region node_modules/d3-shape/src/math.js
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var pi = Math.PI;
pi / 2;
var tau = 2 * pi;
//#endregion
//#region node_modules/d3-shape/src/symbol/circle.js
var circle_default = { draw(context, size) {
	const r = sqrt(size / pi);
	context.moveTo(r, 0);
	context.arc(0, 0, r, 0, tau);
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/cross.js
var cross_default = { draw(context, size) {
	const r = sqrt(size / 5) / 2;
	context.moveTo(-3 * r, -r);
	context.lineTo(-r, -r);
	context.lineTo(-r, -3 * r);
	context.lineTo(r, -3 * r);
	context.lineTo(r, -r);
	context.lineTo(3 * r, -r);
	context.lineTo(3 * r, r);
	context.lineTo(r, r);
	context.lineTo(r, 3 * r);
	context.lineTo(-r, 3 * r);
	context.lineTo(-r, r);
	context.lineTo(-3 * r, r);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/diamond.js
var tan30 = sqrt(1 / 3);
var tan30_2 = tan30 * 2;
var diamond_default = { draw(context, size) {
	const y = sqrt(size / tan30_2);
	const x = y * tan30;
	context.moveTo(0, -y);
	context.lineTo(x, 0);
	context.lineTo(0, y);
	context.lineTo(-x, 0);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/square.js
var square_default = { draw(context, size) {
	const w = sqrt(size);
	const x = -w / 2;
	context.rect(x, x, w, w);
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/star.js
var ka = .8908130915292852;
var kr = sin(pi / 10) / sin(7 * pi / 10);
var kx = sin(tau / 10) * kr;
var ky = -cos(tau / 10) * kr;
var star_default = { draw(context, size) {
	const r = sqrt(size * ka);
	const x = kx * r;
	const y = ky * r;
	context.moveTo(0, -r);
	context.lineTo(x, y);
	for (let i = 1; i < 5; ++i) {
		const a = tau * i / 5;
		const c = cos(a);
		const s = sin(a);
		context.lineTo(s * r, -c * r);
		context.lineTo(c * x - s * y, s * x + c * y);
	}
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/triangle.js
var sqrt3 = sqrt(3);
var triangle_default = { draw(context, size) {
	const y = -sqrt(size / (sqrt3 * 3));
	context.moveTo(0, y * 2);
	context.lineTo(-sqrt3 * y, -y);
	context.lineTo(sqrt3 * y, -y);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol/wye.js
var c = -.5;
var s = sqrt(3) / 2;
var k = 1 / sqrt(12);
var a = (k / 2 + 1) * 3;
var wye_default = { draw(context, size) {
	const r = sqrt(size / a);
	const x0 = r / 2, y0 = r * k;
	const x1 = x0, y1 = r * k + r;
	const x2 = -x1, y2 = y1;
	context.moveTo(x0, y0);
	context.lineTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(c * x0 - s * y0, s * x0 + c * y0);
	context.lineTo(c * x1 - s * y1, s * x1 + c * y1);
	context.lineTo(c * x2 - s * y2, s * x2 + c * y2);
	context.lineTo(c * x0 + s * y0, c * y0 - s * x0);
	context.lineTo(c * x1 + s * y1, c * y1 - s * x1);
	context.lineTo(c * x2 + s * y2, c * y2 - s * x2);
	context.closePath();
} };
//#endregion
//#region node_modules/d3-shape/src/symbol.js
function Symbol$1(type, size) {
	let context = null, path = withPath(symbol);
	type = typeof type === "function" ? type : constant_default(type || circle_default);
	size = typeof size === "function" ? size : constant_default(size === void 0 ? 64 : +size);
	function symbol() {
		let buffer;
		if (!context) context = buffer = path();
		type.apply(this, arguments).draw(context, +size.apply(this, arguments));
		if (buffer) return context = null, buffer + "" || null;
	}
	symbol.type = function(_) {
		return arguments.length ? (type = typeof _ === "function" ? _ : constant_default(_), symbol) : type;
	};
	symbol.size = function(_) {
		return arguments.length ? (size = typeof _ === "function" ? _ : constant_default(+_), symbol) : size;
	};
	symbol.context = function(_) {
		return arguments.length ? (context = _ == null ? null : _, symbol) : context;
	};
	return symbol;
}
//#endregion
//#region node_modules/recharts/es6/shape/Symbols.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var _excluded$4 = [
	"type",
	"size",
	"sizeType"
];
function _extends$6() {
	return _extends$6 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$6.apply(null, arguments);
}
function ownKeys$5(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$5(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$5(Object(t), !0).forEach(function(r) {
			_defineProperty$5(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$5(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$5(e, r, t) {
	return (r = _toPropertyKey$5(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$5(t) {
	var i = _toPrimitive$5(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$5(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$4(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$4(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$4(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
var symbolFactories = {
	symbolCircle: circle_default,
	symbolCross: cross_default,
	symbolDiamond: diamond_default,
	symbolSquare: square_default,
	symbolStar: star_default,
	symbolTriangle: triangle_default,
	symbolWye: wye_default
};
var RADIAN = Math.PI / 180;
var getSymbolFactory = (type) => {
	return symbolFactories["symbol".concat(upperFirst(type))] || circle_default;
};
var calculateAreaSize = (size, sizeType, type) => {
	if (sizeType === "area") return size;
	switch (type) {
		case "cross": return 5 * size * size / 9;
		case "diamond": return .5 * size * size / Math.sqrt(3);
		case "square": return size * size;
		case "star":
			var angle = 18 * RADIAN;
			return 1.25 * size * size * (Math.tan(angle) - Math.tan(angle * 2) * Math.tan(angle) ** 2);
		case "triangle": return Math.sqrt(3) * size * size / 4;
		case "wye": return (21 - 10 * Math.sqrt(3)) * size * size / 8;
		default: return Math.PI * size * size / 4;
	}
};
var registerSymbol = (key, factory) => {
	symbolFactories["symbol".concat(upperFirst(key))] = factory;
};
/**
* Renders a symbol from a set of predefined shapes.
*/
var Symbols = (_ref) => {
	var _ref$type = _ref.type, type = _ref$type === void 0 ? "circle" : _ref$type, _ref$size = _ref.size, size = _ref$size === void 0 ? 64 : _ref$size, _ref$sizeType = _ref.sizeType, sizeType = _ref$sizeType === void 0 ? "area" : _ref$sizeType;
	var props = _objectSpread$5(_objectSpread$5({}, _objectWithoutProperties$4(_ref, _excluded$4)), {}, {
		type,
		size,
		sizeType
	});
	var realType = "circle";
	if (typeof type === "string") realType = type;
	/**
	* Calculate the path of curve
	* @return {String} path
	*/
	var getPath = () => {
		var symbolFactory = getSymbolFactory(realType);
		var s = Symbol$1().type(symbolFactory).size(calculateAreaSize(size, sizeType, realType))();
		if (s === null) return;
		return s;
	};
	var className = props.className, cx = props.cx, cy = props.cy;
	var filteredProps = svgPropertiesAndEvents(props);
	if (isNumber(cx) && isNumber(cy) && isNumber(size)) return /*#__PURE__*/ import_react.createElement("path", _extends$6({}, filteredProps, {
		className: clsx("recharts-symbols", className),
		transform: "translate(".concat(cx, ", ").concat(cy, ")"),
		d: getPath()
	}));
	return null;
};
Symbols.registerSymbol = registerSymbol;
//#endregion
//#region node_modules/recharts/es6/component/DefaultLegendContent.js
function _extends$5() {
	return _extends$5 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$5.apply(null, arguments);
}
function ownKeys$4(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$4(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$4(Object(t), !0).forEach(function(r) {
			_defineProperty$4(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$4(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$4(e, r, t) {
	return (r = _toPropertyKey$4(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$4(t) {
	var i = _toPrimitive$4(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$4(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var SIZE = 32;
var defaultLegendContentDefaultProps = {
	align: "center",
	iconSize: 14,
	inactiveColor: "#ccc",
	layout: "horizontal",
	verticalAlign: "middle",
	labelStyle: {}
};
function getStrokeDasharray(input) {
	if (typeof input === "object" && input !== null && "strokeDasharray" in input) return String(input.strokeDasharray);
}
function Icon(_ref) {
	var data = _ref.data, iconType = _ref.iconType, inactiveColor = _ref.inactiveColor;
	var halfSize = SIZE / 2;
	var sixthSize = SIZE / 6;
	var thirdSize = SIZE / 3;
	var color = data.inactive ? inactiveColor : data.color;
	var preferredIcon = iconType !== null && iconType !== void 0 ? iconType : data.type;
	if (preferredIcon === "none") return null;
	if (preferredIcon === "plainline") return /*#__PURE__*/ import_react.createElement("line", {
		strokeWidth: 4,
		fill: "none",
		stroke: color,
		strokeDasharray: getStrokeDasharray(data.payload),
		x1: 0,
		y1: halfSize,
		x2: SIZE,
		y2: halfSize,
		className: "recharts-legend-icon"
	});
	if (preferredIcon === "line") return /*#__PURE__*/ import_react.createElement("path", {
		strokeWidth: 4,
		fill: "none",
		stroke: color,
		d: "M0,".concat(halfSize, "h").concat(thirdSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(2 * thirdSize, ",").concat(halfSize, "\n            H").concat(SIZE, "M").concat(2 * thirdSize, ",").concat(halfSize, "\n            A").concat(sixthSize, ",").concat(sixthSize, ",0,1,1,").concat(thirdSize, ",").concat(halfSize),
		className: "recharts-legend-icon"
	});
	if (preferredIcon === "rect") return /*#__PURE__*/ import_react.createElement("path", {
		stroke: "none",
		fill: color,
		d: "M0,".concat(SIZE / 8, "h").concat(SIZE, "v").concat(SIZE * 3 / 4, "h").concat(-SIZE, "z"),
		className: "recharts-legend-icon"
	});
	if (/*#__PURE__*/ import_react.isValidElement(data.legendIcon)) {
		var iconProps = _objectSpread$4({}, data);
		delete iconProps.legendIcon;
		return /*#__PURE__*/ import_react.cloneElement(data.legendIcon, iconProps);
	}
	return /*#__PURE__*/ import_react.createElement(Symbols, {
		fill: color,
		cx: halfSize,
		cy: halfSize,
		size: SIZE,
		sizeType: "diameter",
		type: preferredIcon
	});
}
function Items(props) {
	var payload = props.payload, iconSize = props.iconSize, layout = props.layout, formatter = props.formatter, inactiveColor = props.inactiveColor, iconType = props.iconType, labelStyle = props.labelStyle;
	var viewBox = {
		x: 0,
		y: 0,
		width: SIZE,
		height: SIZE
	};
	var itemStyle = {
		display: layout === "horizontal" ? "inline-block" : "block",
		marginRight: 10,
		whiteSpace: "nowrap"
	};
	var svgStyle = {
		display: "inline-block",
		verticalAlign: "middle",
		marginRight: 4
	};
	return payload.map((entry, i) => {
		var _finalLabelStyle$whit, _finalLabelStyle$over;
		var finalFormatter = entry.formatter || formatter;
		var className = clsx({
			"recharts-legend-item": true,
			["legend-item-".concat(i)]: true,
			inactive: entry.inactive
		});
		if (entry.type === "none") return null;
		var finalLabelStyle = typeof labelStyle === "object" ? _objectSpread$4({}, labelStyle) : {};
		finalLabelStyle.color = entry.inactive ? inactiveColor : finalLabelStyle.color || entry.color;
		(_finalLabelStyle$whit = finalLabelStyle.whiteSpace) !== null && _finalLabelStyle$whit !== void 0 || (finalLabelStyle.whiteSpace = "normal");
		(_finalLabelStyle$over = finalLabelStyle.overflowWrap) !== null && _finalLabelStyle$over !== void 0 || (finalLabelStyle.overflowWrap = "break-word");
		var finalValue = finalFormatter ? finalFormatter(entry.value, entry, i) : entry.value;
		return /*#__PURE__*/ import_react.createElement("li", _extends$5({
			className,
			style: itemStyle,
			key: "legend-item-".concat(i)
		}, adaptEventsOfChild(props, entry, i)), /*#__PURE__*/ import_react.createElement(Surface, {
			width: iconSize,
			height: iconSize,
			viewBox,
			style: svgStyle,
			"aria-label": entry.value == null ? "legend icon" : "".concat(entry.value, " legend icon")
		}, /*#__PURE__*/ import_react.createElement(Icon, {
			data: entry,
			iconType,
			inactiveColor
		})), /*#__PURE__*/ import_react.createElement("span", {
			className: "recharts-legend-item-text",
			style: finalLabelStyle
		}, finalValue));
	});
}
/**
* This component is by default rendered inside the {@link Legend} component. You would not use it directly.
*
* You can use this component to customize the content of the legend,
* or you can provide your own completely independent content.
*/
var DefaultLegendContent = (outsideProps) => {
	var props = resolveDefaultProps(outsideProps, defaultLegendContentDefaultProps);
	var payload = props.payload, layout = props.layout, align = props.align;
	if (!payload || !payload.length) return null;
	var finalStyle = {
		padding: 0,
		margin: 0,
		textAlign: layout === "horizontal" ? align : "left"
	};
	return /*#__PURE__*/ import_react.createElement("ul", {
		className: "recharts-default-legend",
		style: finalStyle
	}, /*#__PURE__*/ import_react.createElement(Items, _extends$5({}, props, { payload })));
};
//#endregion
//#region node_modules/recharts/es6/context/legendPayloadContext.js
/**
* Use this hook in Legend, or anywhere else where you want to read the current Legend items.
* @return all Legend items ready to be rendered
*/
function useLegendPayload() {
	return useAppSelector(selectLegendPayload);
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/selectLegendArea.js
var selectLegendArea = createSelector([
	selectChartWidth,
	selectChartHeight,
	selectMargin
], (chartWidth, chartHeight, margin) => {
	return {
		x: margin.left || 0,
		y: margin.top || 0,
		width: Math.max(chartWidth - (margin.left || 0) - (margin.right || 0), 0),
		height: Math.max(chartHeight - (margin.top || 0) - (margin.bottom || 0), 0)
	};
});
//#endregion
//#region node_modules/recharts/es6/cartesian/cartesianPositionToCSSTranslate.js
/**
* CalculatedCartesianPosition returns horizontalAnchor and verticalAnchor
* which work directly with an SVG text element
* but for use in HTML context we have to translate them into CSS transform(translate)
* so this is what this function is doing.
*
* horizontalPosition is type: type TextAnchor = 'start' | 'middle' | 'end' | 'inherit'
* verticalPosition is type: type TextVerticalAnchor = 'start' | 'middle' | 'end'
*
* @param horizontalPosition as returned from {@link getCartesianPosition}
* @param verticalPosition as returned from {@link getCartesianPosition}
* @return CSS transform string
*/
function cartesianPositionToCSSTranslate(horizontalPosition, verticalPosition) {
	var _verticalValues$verti;
	if (horizontalPosition === "start" && verticalPosition === "start") return "";
	var horizontalValues = {
		start: "0",
		middle: "-50%",
		end: "-100%"
	};
	var verticalValues = {
		start: "0",
		middle: "-50%",
		end: "-100%"
	};
	var x = horizontalPosition === "inherit" ? "0" : horizontalValues[horizontalPosition];
	var y = (_verticalValues$verti = verticalValues[verticalPosition]) !== null && _verticalValues$verti !== void 0 ? _verticalValues$verti : "0";
	return "translate(".concat(x, ", ").concat(y, ")");
}
//#endregion
//#region node_modules/recharts/es6/component/Legend.js
var import_react_dom = require_react_dom();
var _excluded$3 = ["contextPayload"];
function _extends$4() {
	return _extends$4 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$4.apply(null, arguments);
}
function _slicedToArray(r, e) {
	return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _nonIterableRest() {
	throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(r, a) {
	if (r) {
		if ("string" == typeof r) return _arrayLikeToArray(r, a);
		var t = {}.toString.call(r).slice(8, -1);
		return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
	}
}
function _arrayLikeToArray(r, a) {
	(null == a || a > r.length) && (a = r.length);
	for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
	return n;
}
function _iterableToArrayLimit(r, l) {
	var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
	if (null != t) {
		var e, n, i, u, a = [], f = !0, o = !1;
		try {
			if (i = (t = t.call(r)).next, 0 === l) {
				if (Object(t) !== t) return;
				f = !1;
			} else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
		} catch (r) {
			o = !0, n = r;
		} finally {
			try {
				if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
			} finally {
				if (o) throw n;
			}
		}
		return a;
	}
}
function _arrayWithHoles(r) {
	if (Array.isArray(r)) return r;
}
function ownKeys$3(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$3(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$3(Object(t), !0).forEach(function(r) {
			_defineProperty$3(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$3(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$3(e, r, t) {
	return (r = _toPropertyKey$3(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$3(t) {
	var i = _toPrimitive$3(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$3(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _objectWithoutProperties$3(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$3(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$3(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function defaultUniqBy(entry) {
	return entry.value;
}
function LegendContent(props) {
	var contextPayload = props.contextPayload, otherProps = _objectWithoutProperties$3(props, _excluded$3);
	var finalPayload = getUniqPayload(contextPayload, props.payloadUniqBy, defaultUniqBy);
	var contentProps = _objectSpread$3(_objectSpread$3({}, otherProps), {}, { payload: finalPayload });
	if (/*#__PURE__*/ import_react.isValidElement(props.content)) return /*#__PURE__*/ import_react.cloneElement(props.content, contentProps);
	if (typeof props.content === "function") return /*#__PURE__*/ import_react.createElement(props.content, contentProps);
	return /*#__PURE__*/ import_react.createElement(DefaultLegendContent, contentProps);
}
function getLayoutForPosition(position) {
	if (position === "left" || position === "right" || position === "insideLeft" || position === "insideRight") return "vertical";
	return "horizontal";
}
function selectPositionViewBox(state, position) {
	if (position == null) return null;
	return isOutsidePosition(position) ? selectLegendArea(state) : selectChartViewBox(state);
}
function getOutsidePositionOffset(position, offset, box) {
	if (position === "top") return { top: box.height + offset };
	if (position === "bottom") return { top: -box.height - offset };
	if (position === "left") return { left: box.width + offset };
	if (position === "right") return { left: -box.width - offset };
	return {};
}
function getDefaultPosition(style, props, margin, chartWidth, chartHeight, box) {
	var layout = props.layout, align = props.align, verticalAlign = props.verticalAlign;
	var hPos, vPos;
	if (!style || (style.left === void 0 || style.left === null) && (style.right === void 0 || style.right === null)) {
		if (align === "center" && layout === "vertical") hPos = { left: ((chartWidth || 0) - box.width) / 2 };
		else hPos = align === "right" ? { right: margin && margin.right || 0 } : { left: margin && margin.left || 0 };
	}
	if (!style || (style.top === void 0 || style.top === null) && (style.bottom === void 0 || style.bottom === null)) {
		if (verticalAlign === "middle") vPos = { top: ((chartHeight || 0) - box.height) / 2 };
		else vPos = verticalAlign === "bottom" ? { bottom: margin && margin.bottom || 0 } : { top: margin && margin.top || 0 };
	}
	return _objectSpread$3(_objectSpread$3({}, hPos), vPos);
}
function LegendSettingsDispatcher(_ref) {
	var align = _ref.align, layout = _ref.layout, verticalAlign = _ref.verticalAlign, itemSorter = _ref.itemSorter, position = _ref.position, offset = _ref.offset;
	var dispatch = useAppDispatch();
	(0, import_react.useLayoutEffect)(() => {
		dispatch(setLegendSettings({
			align,
			layout,
			verticalAlign,
			itemSorter,
			position,
			offset
		}));
	}, [
		dispatch,
		align,
		layout,
		verticalAlign,
		itemSorter,
		position,
		offset
	]);
	return null;
}
function LegendSizeDispatcher(_ref2) {
	var width = _ref2.width, height = _ref2.height;
	var dispatch = useAppDispatch();
	(0, import_react.useLayoutEffect)(() => {
		dispatch(setLegendSize({
			width,
			height
		}));
	}, [
		dispatch,
		width,
		height
	]);
	(0, import_react.useLayoutEffect)(() => {
		return () => {
			dispatch(setLegendSize({
				width: 0,
				height: 0
			}));
		};
	}, [dispatch]);
	return null;
}
function getWidthOrHeight(layout, height, width, maxWidth) {
	if (layout === "vertical" && height != null) return { height };
	if (layout === "horizontal") return { width: width || maxWidth };
	return null;
}
var legendDefaultProps = {
	align: "center",
	iconSize: 14,
	inactiveColor: "#ccc",
	itemSorter: "value",
	labelStyle: {},
	layout: "auto",
	verticalAlign: "bottom",
	offset: 0
};
/**
* @consumes CartesianChartContext
* @consumes PolarChartContext
*/
function LegendImpl(outsideProps) {
	var _props$offset, _props$offset2, _positionViewBox$widt, _positionViewBox$widt2, _positionViewBox$heig, _positionViewBox$heig2, _outsidePositionOffse, _outsidePositionOffse2;
	var props = resolveDefaultProps(outsideProps, legendDefaultProps);
	var layout = outsideProps.layout && outsideProps.layout !== "auto" ? outsideProps.layout : getLayoutForPosition(props.position);
	var contextPayload = useLegendPayload();
	var legendPortalFromContext = useLegendPortal();
	var margin = useMargin();
	var positionViewBox = useAppSelector((state) => selectPositionViewBox(state, props.position));
	var widthFromProps = props.width, heightFromProps = props.height, wrapperStyle = props.wrapperStyle, portalFromProps = props.portal;
	var shouldReportDimensions = portalFromProps == null && (props.position == null || isOutsidePosition(props.position));
	var _useElementOffset2 = _slicedToArray(useElementOffset([contextPayload]), 2), lastBoundingBox = _useElementOffset2[0], updateBoundingBox = _useElementOffset2[1];
	var chartWidth = useChartWidth();
	var chartHeight = useChartHeight();
	if (chartWidth == null || chartHeight == null || props.position != null && positionViewBox == null) return null;
	var widthOrHeight = getWidthOrHeight(layout, heightFromProps, widthFromProps, chartWidth - ((margin === null || margin === void 0 ? void 0 : margin.left) || 0) - ((margin === null || margin === void 0 ? void 0 : margin.right) || 0));
	var positionResult = props.position == null ? null : getCartesianPosition({
		viewBox: positionViewBox !== null && positionViewBox !== void 0 ? positionViewBox : {
			x: 0,
			y: 0,
			width: chartWidth,
			height: chartHeight
		},
		position: props.position,
		offset: (_props$offset = props.offset) !== null && _props$offset !== void 0 ? _props$offset : 0
	});
	var outsidePositionOffset = getOutsidePositionOffset(props.position, (_props$offset2 = props.offset) !== null && _props$offset2 !== void 0 ? _props$offset2 : 0, lastBoundingBox);
	var positionMaxWidth = layout === "vertical" ? ((_positionViewBox$widt = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.width) !== null && _positionViewBox$widt !== void 0 ? _positionViewBox$widt : 0) / 2 : (_positionViewBox$widt2 = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.width) !== null && _positionViewBox$widt2 !== void 0 ? _positionViewBox$widt2 : 0;
	var positionMaxHeight = layout === "horizontal" ? ((_positionViewBox$heig = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.height) !== null && _positionViewBox$heig !== void 0 ? _positionViewBox$heig : 0) / 2 : (_positionViewBox$heig2 = positionViewBox === null || positionViewBox === void 0 ? void 0 : positionViewBox.height) !== null && _positionViewBox$heig2 !== void 0 ? _positionViewBox$heig2 : 0;
	var positionStyle = positionResult ? {
		width: "max-content",
		height: "max-content",
		maxWidth: positionMaxWidth,
		maxHeight: positionMaxHeight,
		overflowY: "auto",
		top: positionResult.y + ((_outsidePositionOffse = outsidePositionOffset.top) !== null && _outsidePositionOffse !== void 0 ? _outsidePositionOffse : 0),
		left: positionResult.x + ((_outsidePositionOffse2 = outsidePositionOffset.left) !== null && _outsidePositionOffse2 !== void 0 ? _outsidePositionOffse2 : 0),
		transform: cartesianPositionToCSSTranslate(positionResult.horizontalAnchor, positionResult.verticalAnchor)
	} : getDefaultPosition(wrapperStyle, props, margin, chartWidth, chartHeight, lastBoundingBox);
	var outerStyle = portalFromProps ? wrapperStyle : _objectSpread$3(_objectSpread$3({
		position: "absolute",
		width: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.width) || widthFromProps || "auto",
		height: (widthOrHeight === null || widthOrHeight === void 0 ? void 0 : widthOrHeight.height) || heightFromProps || "auto"
	}, positionStyle), wrapperStyle);
	var legendPortal = portalFromProps !== null && portalFromProps !== void 0 ? portalFromProps : legendPortalFromContext;
	if (legendPortal == null || contextPayload == null) return null;
	var legendElement = /*#__PURE__*/ import_react.createElement("div", {
		className: "recharts-legend-wrapper",
		style: outerStyle,
		ref: updateBoundingBox
	}, /*#__PURE__*/ import_react.createElement(LegendSettingsDispatcher, {
		layout,
		align: props.align,
		verticalAlign: props.verticalAlign,
		itemSorter: props.itemSorter,
		position: props.position,
		offset: props.offset
	}), shouldReportDimensions && /*#__PURE__*/ import_react.createElement(LegendSizeDispatcher, lastBoundingBox), /*#__PURE__*/ import_react.createElement(LegendContent, _extends$4({}, props, { layout }, widthOrHeight, {
		margin,
		chartWidth,
		chartHeight,
		contextPayload
	})));
	return /*#__PURE__*/ (0, import_react_dom.createPortal)(legendElement, legendPortal);
}
var Legend = /*#__PURE__*/ import_react.memo(LegendImpl, propsAreEqual);
Legend.displayName = "Legend";
//#endregion
//#region node_modules/recharts/es6/shape/Dot.js
function _extends$3() {
	return _extends$3 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$3.apply(null, arguments);
}
/**
* Renders a dot in the chart.
*
* This component accepts X and Y coordinates in pixels.
* If you need to position the rectangle based on your chart's data,
* consider using the {@link ReferenceDot} component instead.
*
* @param props
* @constructor
*/
var Dot = (props) => {
	var cx = props.cx, cy = props.cy, r = props.r, className = props.className;
	var layerClass = clsx("recharts-dot", className);
	if (isNumber(cx) && isNumber(cy) && isNumber(r)) return /*#__PURE__*/ import_react.createElement("circle", _extends$3({}, svgPropertiesNoEvents(props), adaptEventHandlers(props), {
		className: layerClass,
		cx,
		cy,
		r
	}));
	return null;
};
//#endregion
//#region node_modules/recharts/es6/component/Dots.js
var _excluded$2 = ["points"];
function ownKeys$2(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$2(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$2(Object(t), !0).forEach(function(r) {
			_defineProperty$2(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$2(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$2(e, r, t) {
	return (r = _toPropertyKey$2(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$2(t) {
	var i = _toPrimitive$2(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$2(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
function _extends$2() {
	return _extends$2 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$2.apply(null, arguments);
}
function _objectWithoutProperties$2(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$2(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$2(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function DotItem(_ref) {
	var option = _ref.option, dotProps = _ref.dotProps, className = _ref.className;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(option)) return /*#__PURE__*/ (0, import_react.cloneElement)(option, dotProps);
	if (typeof option === "function") return option(dotProps);
	var finalClassName = clsx(className, typeof option !== "boolean" ? option.className : ""), _ref2 = dotProps !== null && dotProps !== void 0 ? dotProps : {};
	_ref2.points;
	var props = _objectWithoutProperties$2(_ref2, _excluded$2);
	return /*#__PURE__*/ import_react.createElement(Dot, _extends$2({}, props, { className: finalClassName }));
}
function shouldRenderDots(points, dot) {
	if (points == null) return false;
	if (dot) return true;
	return points.length === 1;
}
function Dots(_ref3) {
	var points = _ref3.points, dot = _ref3.dot, className = _ref3.className, dotClassName = _ref3.dotClassName, dataKey = _ref3.dataKey, baseProps = _ref3.baseProps, needClip = _ref3.needClip, clipPathId = _ref3.clipPathId, _ref3$zIndex = _ref3.zIndex, zIndex = _ref3$zIndex === void 0 ? DefaultZIndexes.scatter : _ref3$zIndex;
	if (!shouldRenderDots(points, dot)) return null;
	var clipDot = isClipDot(dot);
	var customDotProps = svgPropertiesAndEventsFromUnknown(dot);
	var dots = points.map((entry, i) => {
		var _entry$x, _entry$y;
		var dotProps = _objectSpread$2(_objectSpread$2(_objectSpread$2({ r: 3 }, baseProps), customDotProps), {}, {
			index: i,
			cx: (_entry$x = entry.x) !== null && _entry$x !== void 0 ? _entry$x : void 0,
			cy: (_entry$y = entry.y) !== null && _entry$y !== void 0 ? _entry$y : void 0,
			dataKey,
			value: entry.value,
			payload: entry.payload,
			points
		});
		return /*#__PURE__*/ import_react.createElement(DotItem, {
			key: "dot-".concat(i),
			option: dot,
			dotProps,
			className: dotClassName
		});
	});
	var layerProps = {};
	if (needClip && clipPathId != null) layerProps.clipPath = "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")");
	return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(Layer, _extends$2({ className }, layerProps), dots));
}
//#endregion
//#region node_modules/recharts/es6/component/ActivePoints.js
function ownKeys$1(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread$1(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys$1(Object(t), !0).forEach(function(r) {
			_defineProperty$1(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys$1(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty$1(e, r, t) {
	return (r = _toPropertyKey$1(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey$1(t) {
	var i = _toPrimitive$1(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive$1(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
var ActivePoint = (_ref) => {
	var point = _ref.point, childIndex = _ref.childIndex, mainColor = _ref.mainColor, activeDot = _ref.activeDot, dataKey = _ref.dataKey, clipPath = _ref.clipPath;
	if (activeDot === false || point.x == null || point.y == null) return null;
	var dotProps = _objectSpread$1(_objectSpread$1(_objectSpread$1({}, {
		index: childIndex,
		dataKey,
		cx: point.x,
		cy: point.y,
		r: 4,
		fill: mainColor !== null && mainColor !== void 0 ? mainColor : "none",
		strokeWidth: 2,
		stroke: "#fff",
		payload: point.payload,
		value: point.value
	}), svgPropertiesNoEventsFromUnknown(activeDot)), adaptEventHandlers(activeDot));
	var dot;
	if (/*#__PURE__*/ (0, import_react.isValidElement)(activeDot)) dot = /*#__PURE__*/ (0, import_react.cloneElement)(activeDot, dotProps);
	else if (typeof activeDot === "function") dot = activeDot(dotProps);
	else dot = /*#__PURE__*/ import_react.createElement(Dot, dotProps);
	return /*#__PURE__*/ import_react.createElement(Layer, {
		className: "recharts-active-dot",
		clipPath
	}, dot);
};
function ActivePoints(_ref2) {
	var points = _ref2.points, mainColor = _ref2.mainColor, activeDot = _ref2.activeDot, itemDataKey = _ref2.itemDataKey, clipPath = _ref2.clipPath, _ref2$zIndex = _ref2.zIndex, zIndex = _ref2$zIndex === void 0 ? DefaultZIndexes.activeDot : _ref2$zIndex;
	var activeTooltipIndex = useAppSelector(selectActiveTooltipIndex);
	var activeDataPoints = useActiveTooltipDataPoints();
	if (points == null || activeDataPoints == null) return null;
	var activePoint = points.find((p) => activeDataPoints.includes(p.payload));
	if (isNullish(activePoint)) return null;
	return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(ActivePoint, {
		point: activePoint,
		childIndex: Number(activeTooltipIndex),
		mainColor,
		dataKey: itemDataKey,
		activeDot,
		clipPath
	}));
}
//#endregion
//#region node_modules/recharts/es6/util/getRadiusAndStrokeWidthFromDot.js
function getRadiusAndStrokeWidthFromDot(dot) {
	var props = svgPropertiesNoEventsFromUnknown(dot);
	var defaultR = 3;
	var defaultStrokeWidth = 2;
	if (props != null) {
		var r = props.r, strokeWidth = props.strokeWidth;
		var realR = Number(r);
		var realStrokeWidth = Number(strokeWidth);
		if (Number.isNaN(realR) || realR < 0) realR = defaultR;
		if (Number.isNaN(realStrokeWidth) || realStrokeWidth < 0) realStrokeWidth = defaultStrokeWidth;
		return {
			r: realR,
			strokeWidth: realStrokeWidth
		};
	}
	return {
		r: defaultR,
		strokeWidth: defaultStrokeWidth
	};
}
//#endregion
//#region node_modules/recharts/es6/state/selectors/areaSelectors.js
var selectXAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectXAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "xAxis", selectXAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisWithScale = (state, graphicalItemId, isPanorama) => selectAxisWithScale(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectYAxisTicks = (state, graphicalItemId, isPanorama) => selectTicksOfGraphicalItem(state, "yAxis", selectYAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectBandSize = createSelector([
	selectChartLayout,
	selectXAxisWithScale,
	selectYAxisWithScale,
	selectXAxisTicks,
	selectYAxisTicks
], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks) => {
	if (isCategoricalAxis(layout, "xAxis")) return getBandSizeOfAxis(xAxis, xAxisTicks, false);
	return getBandSizeOfAxis(yAxis, yAxisTicks, false);
});
var pickAreaId = (_state, id) => id;
var selectSynchronisedAreaSettings = createSelector([selectUnfilteredCartesianItems, pickAreaId], (graphicalItems, id) => graphicalItems.filter((item) => item.type === "area").find((item) => item.id === id));
var selectNumericalAxisType = (state) => {
	var layout = selectChartLayout(state);
	return isCategoricalAxis(layout, "xAxis") ? "yAxis" : "xAxis";
};
var selectNumericalAxisIdFromGraphicalItemId = (state, graphicalItemId) => {
	if (selectNumericalAxisType(state) === "yAxis") return selectYAxisIdFromGraphicalItemId(state, graphicalItemId);
	return selectXAxisIdFromGraphicalItemId(state, graphicalItemId);
};
var selectNumericalAxisStackGroups = (state, graphicalItemId, isPanorama) => selectStackGroups(state, selectNumericalAxisType(state), selectNumericalAxisIdFromGraphicalItemId(state, graphicalItemId), isPanorama);
var selectGraphicalItemStackedData = createSelector([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
	var _stackGroups$stackId;
	if (areaSettings == null || stackGroups == null) return;
	var stackId = areaSettings.stackId;
	var stackSeriesIdentifier = getStackSeriesIdentifier(areaSettings);
	if (stackId == null || stackSeriesIdentifier == null) return;
	var groups = (_stackGroups$stackId = stackGroups[stackId]) === null || _stackGroups$stackId === void 0 ? void 0 : _stackGroups$stackId.stackedData;
	var found = groups === null || groups === void 0 ? void 0 : groups.find((v) => v.key === stackSeriesIdentifier);
	if (found == null) return;
	return found.map((item) => [item[0], item[1]]);
});
var selectStackDataKeys = createSelector([selectSynchronisedAreaSettings, selectNumericalAxisStackGroups], (areaSettings, stackGroups) => {
	if (areaSettings == null || areaSettings.stackId == null || stackGroups == null) return;
	var group = stackGroups[areaSettings.stackId];
	if (group == null) return;
	return group.graphicalItems.map((item) => item.dataKey).filter(isNotNil);
});
var selectArea = createSelector([
	selectChartLayout,
	selectXAxisWithScale,
	selectYAxisWithScale,
	selectXAxisTicks,
	selectYAxisTicks,
	selectGraphicalItemStackedData,
	selectChartDataWithIndexesIfNotInPanoramaPosition3,
	selectBandSize,
	selectSynchronisedAreaSettings,
	selectChartBaseValue,
	selectStackDataKeys
], (layout, xAxis, yAxis, xAxisTicks, yAxisTicks, stackedData, _ref, bandSize, areaSettings, chartBaseValue, stackDataKeys) => {
	var chartData = _ref.chartData, dataStartIndex = _ref.dataStartIndex, dataEndIndex = _ref.dataEndIndex;
	if (areaSettings == null || layout !== "horizontal" && layout !== "vertical" || xAxis == null || yAxis == null || xAxisTicks == null || yAxisTicks == null || xAxisTicks.length === 0 || yAxisTicks.length === 0 || bandSize == null) return;
	var data = areaSettings.data;
	var displayedData;
	if (data && data.length > 0) displayedData = data;
	else displayedData = chartData === null || chartData === void 0 ? void 0 : chartData.slice(dataStartIndex, dataEndIndex + 1);
	if (displayedData == null) return;
	return computeArea({
		layout,
		xAxis,
		yAxis,
		xAxisTicks,
		yAxisTicks,
		dataStartIndex,
		areaSettings,
		stackedData,
		displayedData,
		chartBaseValue,
		bandSize,
		stackDataKeys
	});
});
//#endregion
//#region node_modules/recharts/es6/cartesian/AreaRevealShape.js
var _excluded$1 = [
	"animationElapsedTime",
	"isAnimating",
	"isEntrance",
	"layout",
	"isRange",
	"stroke",
	"connectNulls"
];
var _excluded2$1 = ["id", "baseLine"];
function _extends$1() {
	return _extends$1 = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends$1.apply(null, arguments);
}
function _objectWithoutProperties$1(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose$1(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose$1(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
/**
* Props for the clip-path rect computation.
* @internal
*/
function HorizontalClipRect(_ref) {
	var _points$, _points;
	var alpha = _ref.alpha, baseLine = _ref.baseLine, points = _ref.points, strokeWidth = _ref.strokeWidth;
	var startX = (_points$ = points[0]) === null || _points$ === void 0 ? void 0 : _points$.x;
	var endX = (_points = points[points.length - 1]) === null || _points === void 0 ? void 0 : _points.x;
	if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) return null;
	var width = alpha * Math.abs(startX - endX);
	var maxY = Math.max(...points.map((entry) => entry.y || 0));
	if (isNumber(baseLine)) maxY = Math.max(baseLine, maxY);
	else if (baseLine && Array.isArray(baseLine) && baseLine.length) maxY = Math.max(...baseLine.map((entry) => entry.y || 0), maxY);
	if (isNumber(maxY)) return /*#__PURE__*/ import_react.createElement("rect", {
		x: startX < endX ? startX : startX - width,
		y: 0,
		width,
		height: Math.floor(maxY + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1))
	});
	return null;
}
function VerticalClipRect(_ref2) {
	var _points$2, _points2;
	var alpha = _ref2.alpha, baseLine = _ref2.baseLine, points = _ref2.points, strokeWidth = _ref2.strokeWidth;
	var startY = (_points$2 = points[0]) === null || _points$2 === void 0 ? void 0 : _points$2.y;
	var endY = (_points2 = points[points.length - 1]) === null || _points2 === void 0 ? void 0 : _points2.y;
	if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) return null;
	var height = alpha * Math.abs(startY - endY);
	var maxX = Math.max(...points.map((entry) => entry.x || 0));
	if (isNumber(baseLine)) maxX = Math.max(baseLine, maxX);
	else if (baseLine && Array.isArray(baseLine) && baseLine.length) maxX = Math.max(...baseLine.map((entry) => entry.x || 0), maxX);
	if (isNumber(maxX)) return /*#__PURE__*/ import_react.createElement("rect", {
		x: 0,
		y: startY < endY ? startY : startY - height,
		width: maxX + (strokeWidth ? parseInt("".concat(strokeWidth), 10) : 1),
		height: Math.floor(height)
	});
	return null;
}
function RevealClipRect(_ref3) {
	var alpha = _ref3.alpha, layout = _ref3.layout, points = _ref3.points, baseLine = _ref3.baseLine, strokeWidth = _ref3.strokeWidth;
	if (layout === "vertical") return /*#__PURE__*/ import_react.createElement(VerticalClipRect, {
		alpha,
		points,
		baseLine,
		strokeWidth
	});
	return /*#__PURE__*/ import_react.createElement(HorizontalClipRect, {
		alpha,
		points,
		baseLine,
		strokeWidth
	});
}
/**
* The default shape for Area that reveals the chart with a left-to-right (or top-to-bottom)
* clip-path animation on entrance, and renders the plain curve otherwise.
*
* This component renders the complete Area visual: the filled area curve, the stroke curve,
* and (for range areas) the baseline stroke curve. During entrance animation, all curves are
* wrapped in a clip-path that progressively reveals the area.
*
* This is the built-in entrance animation for Area. It is automatically used when no custom
* `shape` prop is provided. You can import and reuse it as a starting point for custom shapes.
*
* @example
* ```tsx
* import { Area, AreaRevealShape } from 'recharts';
*
* // Use the default shape explicitly (same as providing no shape prop)
* <Area dataKey="value" shape={AreaRevealShape} />
* ```
*
* @see {@link https://recharts.github.io/en-US/guide/animations Animation guide}
*
* @since 3.9
*/
function AreaRevealShape(props) {
	var _props$animationElaps = props.animationElapsedTime, animationElapsedTime = _props$animationElaps === void 0 ? 1 : _props$animationElaps, _props$isAnimating = props.isAnimating, isAnimating = _props$isAnimating === void 0 ? false : _props$isAnimating, _props$isEntrance = props.isEntrance, isEntrance = _props$isEntrance === void 0 ? false : _props$isEntrance, layoutProp = props.layout, isRange = props.isRange, stroke = props.stroke, connectNulls = props.connectNulls, restProps = _objectWithoutProperties$1(props, _excluded$1);
	var layout = layoutProp === "vertical" ? "vertical" : "horizontal";
	var finalConnectNulls = connectNulls !== null && connectNulls !== void 0 ? connectNulls : false;
	var clipId = useId();
	var id = restProps.id, baseLine = restProps.baseLine, propsWithoutIdBaseline = _objectWithoutProperties$1(restProps, _excluded2$1);
	var strokeSvgProps = svgPropertiesNoEvents(propsWithoutIdBaseline);
	var fillCurve = /*#__PURE__*/ import_react.createElement(Curve, _extends$1({}, restProps, {
		id,
		baseLine,
		connectNulls: finalConnectNulls,
		stroke: "none",
		className: "recharts-area-area",
		layout
	}));
	var strokeCurve = stroke !== "none" && /*#__PURE__*/ import_react.createElement(Curve, _extends$1({}, strokeSvgProps, {
		className: "recharts-area-curve",
		layout,
		type: restProps.type,
		connectNulls: finalConnectNulls,
		fill: "none",
		stroke,
		points: restProps.points
	}));
	var baselineCurve = stroke !== "none" && isRange && Array.isArray(baseLine) && /*#__PURE__*/ import_react.createElement(Curve, _extends$1({}, strokeSvgProps, {
		className: "recharts-area-curve",
		layout,
		type: restProps.type,
		connectNulls: finalConnectNulls,
		fill: "none",
		stroke,
		points: baseLine
	}));
	if (isEntrance && (isAnimating || animationElapsedTime < 1)) {
		var _restProps$points;
		return /*#__PURE__*/ import_react.createElement(Layer, null, /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement("clipPath", { id: clipId }, /*#__PURE__*/ import_react.createElement(RevealClipRect, {
			alpha: animationElapsedTime,
			points: (_restProps$points = restProps.points) !== null && _restProps$points !== void 0 ? _restProps$points : [],
			baseLine,
			layout,
			strokeWidth: restProps.strokeWidth
		}))), /*#__PURE__*/ import_react.createElement(Layer, { clipPath: "url(#".concat(clipId, ")") }, fillCurve, strokeCurve, baselineCurve));
	}
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, fillCurve, strokeCurve, baselineCurve);
}
//#endregion
//#region node_modules/recharts/es6/cartesian/Area.js
var _excluded = ["id"];
var _excluded2 = [
	"activeDot",
	"animationBegin",
	"animationDuration",
	"animationEasing",
	"connectNulls",
	"dot",
	"fill",
	"fillOpacity",
	"hide",
	"isAnimationActive",
	"legendType",
	"stroke",
	"xAxisId",
	"yAxisId"
];
function _extends() {
	return _extends = Object.assign ? Object.assign.bind() : function(n) {
		for (var e = 1; e < arguments.length; e++) {
			var t = arguments[e];
			for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
		}
		return n;
	}, _extends.apply(null, arguments);
}
function _objectWithoutProperties(e, t) {
	if (null == e) return {};
	var o, r, i = _objectWithoutPropertiesLoose(e, t);
	if (Object.getOwnPropertySymbols) {
		var n = Object.getOwnPropertySymbols(e);
		for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
	}
	return i;
}
function _objectWithoutPropertiesLoose(r, e) {
	if (null == r) return {};
	var t = {};
	for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
		if (-1 !== e.indexOf(n)) continue;
		t[n] = r[n];
	}
	return t;
}
function ownKeys(e, r) {
	var t = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var o = Object.getOwnPropertySymbols(e);
		r && (o = o.filter(function(r) {
			return Object.getOwnPropertyDescriptor(e, r).enumerable;
		})), t.push.apply(t, o);
	}
	return t;
}
function _objectSpread(e) {
	for (var r = 1; r < arguments.length; r++) {
		var t = null != arguments[r] ? arguments[r] : {};
		r % 2 ? ownKeys(Object(t), !0).forEach(function(r) {
			_defineProperty(e, r, t[r]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r) {
			Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
		});
	}
	return e;
}
function _defineProperty(e, r, t) {
	return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
		value: t,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[r] = t, e;
}
function _toPropertyKey(t) {
	var i = _toPrimitive(t, "string");
	return "symbol" == typeof i ? i : i + "";
}
function _toPrimitive(t, r) {
	if ("object" != typeof t || !t) return t;
	var e = t[Symbol.toPrimitive];
	if (void 0 !== e) {
		var i = e.call(t, r || "default");
		if ("object" != typeof i) return i;
		throw new TypeError("@@toPrimitive must return a primitive value.");
	}
	return ("string" === r ? String : Number)(t);
}
/**
* @inline
*/
/**
* Our base value array has payload in it, and we expose it externally too.
*/
/**
* Internal props, combination of external props + defaultProps + private Recharts state
*/
/**
* External props, intended for end users to fill in
*/
var defaultAreaAnimateItems = (items, animationElapsedTime) => {
	if (items == null) return [];
	if (animationElapsedTime === 1) return items.flatMap((item) => item.status === "removed" ? [] : [item.next]);
	return items.flatMap((item) => {
		if (item.status === "matched") return [_objectSpread(_objectSpread({}, item.next), {}, {
			x: interpolate(item.prev.x, item.next.x, animationElapsedTime),
			y: interpolate(item.prev.y, item.next.y, animationElapsedTime)
		})];
		if (item.status === "added") return [item.next];
		return [];
	});
};
var defaultAreaProps = {
	activeDot: true,
	animationBegin: 0,
	animationDuration: 1500,
	animationEasing: "ease",
	animationMatchBy: matchByIndex,
	animationInterpolateFn: defaultAreaAnimateItems,
	connectNulls: false,
	dot: false,
	fill: "#3182bd",
	fillOpacity: .6,
	hide: false,
	isAnimationActive: "auto",
	legendType: "line",
	stroke: "#3182bd",
	strokeWidth: 1,
	type: "linear",
	label: false,
	shape: AreaRevealShape,
	xAxisId: 0,
	yAxisId: 0,
	zIndex: DefaultZIndexes.area
};
/**
* Because of naming conflict, we are forced to ignore certain (valid) SVG attributes.
*/
function getLegendItemColor(stroke, fill) {
	return stroke && stroke !== "none" ? stroke : fill;
}
var computeLegendPayloadFromAreaData = (props) => {
	var dataKey = props.dataKey, name = props.name, stroke = props.stroke, fill = props.fill, legendType = props.legendType;
	return [{
		inactive: props.hide,
		dataKey,
		type: legendType,
		color: getLegendItemColor(stroke, fill),
		value: getTooltipNameProp(name, dataKey),
		payload: props
	}];
};
var SetAreaTooltipEntrySettings = /*#__PURE__*/ import_react.memo((_ref) => {
	var dataKey = _ref.dataKey, data = _ref.data, stroke = _ref.stroke, strokeWidth = _ref.strokeWidth, fill = _ref.fill, name = _ref.name, hide = _ref.hide, unit = _ref.unit, formatter = _ref.formatter, tooltipType = _ref.tooltipType, id = _ref.id;
	var tooltipEntrySettings = {
		dataDefinedOnItem: data,
		getPosition: noop,
		settings: {
			stroke,
			strokeWidth,
			fill,
			dataKey,
			nameKey: void 0,
			name: getTooltipNameProp(name, dataKey),
			hide,
			type: tooltipType,
			color: getLegendItemColor(stroke, fill),
			unit,
			formatter,
			graphicalItemId: id
		}
	};
	return /*#__PURE__*/ import_react.createElement(SetTooltipEntrySettings, { tooltipEntrySettings });
});
function AreaDotsWrapper(_ref2) {
	var clipPathId = _ref2.clipPathId, points = _ref2.points, props = _ref2.props;
	var needClip = props.needClip, dot = props.dot, dataKey = props.dataKey;
	var areaProps = svgPropertiesNoEvents(props);
	return /*#__PURE__*/ import_react.createElement(Dots, {
		points,
		dot,
		className: "recharts-area-dots",
		dotClassName: "recharts-area-dot",
		dataKey,
		baseProps: areaProps,
		needClip,
		clipPathId
	});
}
function AreaLabelListProvider(_ref3) {
	var showLabels = _ref3.showLabels, children = _ref3.children;
	var labelListEntries = _ref3.points.map((point) => {
		var _point$x, _point$y;
		var viewBox = {
			x: (_point$x = point.x) !== null && _point$x !== void 0 ? _point$x : 0,
			y: (_point$y = point.y) !== null && _point$y !== void 0 ? _point$y : 0,
			width: 0,
			lowerWidth: 0,
			upperWidth: 0,
			height: 0
		};
		return _objectSpread(_objectSpread({}, viewBox), {}, {
			value: point.value,
			payload: point.payload,
			parentViewBox: void 0,
			viewBox,
			fill: void 0
		});
	});
	return /*#__PURE__*/ import_react.createElement(CartesianLabelListContextProvider, { value: showLabels ? labelListEntries : void 0 }, children);
}
function StaticArea(_ref4) {
	var points = _ref4.points, baseLine = _ref4.baseLine, needClip = _ref4.needClip, clipPathId = _ref4.clipPathId, props = _ref4.props, animationElapsedTime = _ref4.animationElapsedTime, isAnimating = _ref4.isAnimating, isEntrance = _ref4.isEntrance;
	var layout = props.layout, type = props.type, stroke = props.stroke, connectNulls = props.connectNulls, isRange = props.isRange, shape = props.shape;
	var id = props.id, propsWithoutId = _objectWithoutProperties(props, _excluded);
	var curveProps = _objectSpread(_objectSpread({}, svgPropertiesAndEvents(propsWithoutId)), {}, {
		id,
		points,
		connectNulls,
		type,
		baseLine,
		layout,
		stroke,
		isRange,
		animationElapsedTime,
		isAnimating,
		isEntrance
	});
	return /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, (points === null || points === void 0 ? void 0 : points.length) > 1 && /*#__PURE__*/ import_react.createElement(Layer, { clipPath: needClip ? "url(#clipPath-".concat(clipPathId, ")") : void 0 }, /*#__PURE__*/ import_react.createElement(Shape, {
		option: shape,
		DefaultShape: defaultAreaProps.shape,
		shapeProps: curveProps
	})), /*#__PURE__*/ import_react.createElement(AreaDotsWrapper, {
		points,
		props: propsWithoutId,
		clipPathId
	}));
}
function interpolateScalarBaseLine(baseLine, prevBaseLine, animationElapsedTime) {
	if (isNumber(baseLine)) {
		var previousNumberBaseLine = isNumber(prevBaseLine) ? prevBaseLine : void 0;
		return interpolate(previousNumberBaseLine, baseLine, animationElapsedTime);
	}
	if (isNullish(baseLine) || isNan(baseLine)) {
		var _previousNumberBaseLine = isNumber(prevBaseLine) ? prevBaseLine : void 0;
		return interpolate(_previousNumberBaseLine, 0, animationElapsedTime);
	}
	return baseLine;
}
function AreaWithAnimation(_ref5) {
	var needClip = _ref5.needClip, clipPathId = _ref5.clipPathId, props = _ref5.props, previousPointsRef = _ref5.previousPointsRef, previousBaselineRef = _ref5.previousBaselineRef;
	var points = props.points, baseLine = props.baseLine, isAnimationActive = props.isAnimationActive, animationBegin = props.animationBegin, animationDuration = props.animationDuration, animationEasing = props.animationEasing, animationMatchBy = props.animationMatchBy, animationInterpolateFn = props.animationInterpolateFn;
	var animationInput = (0, import_react.useMemo)(() => ({
		points,
		baseLine
	}), [points, baseLine]);
	var baseLineAnimationState = useAnimationStartSnapshot(animationInput, previousBaselineRef);
	var layout = useCartesianChartLayout();
	var _useAnimationCallback = useAnimationCallbacks(props.onAnimationStart, props.onAnimationEnd), isAnimating = _useAnimationCallback.isAnimating, handleAnimationStart = _useAnimationCallback.handleAnimationStart, handleAnimationEnd = _useAnimationCallback.handleAnimationEnd;
	var prevBaseLine = baseLineAnimationState.startValue;
	if (layout == null) return null;
	var baseLineAnimationItems;
	if (Array.isArray(baseLine) && Array.isArray(prevBaseLine)) baseLineAnimationItems = matchAnimationItems(prevBaseLine, baseLine, animationMatchBy);
	else if (Array.isArray(baseLine)) baseLineAnimationItems = matchAnimationItems(null, baseLine, animationMatchBy);
	else baseLineAnimationItems = null;
	return /*#__PURE__*/ import_react.createElement(AnimatedItems, {
		animationInput,
		animationIdPrefix: "recharts-area-",
		items: points,
		previousItemsRef: previousPointsRef,
		isAnimationActive,
		animationBegin,
		animationDuration,
		animationEasing,
		onAnimationStart: handleAnimationStart,
		onAnimationEnd: handleAnimationEnd,
		animationInterpolateFn,
		animationMatchBy,
		layout
	}, (stepPoints, animationElapsedTime, isEntrance) => {
		var stepBaseLine;
		if (animationElapsedTime === 1) stepBaseLine = baseLine;
		else if (Array.isArray(baseLine)) stepBaseLine = animationInterpolateFn(baseLineAnimationItems, animationElapsedTime, layout);
		else stepBaseLine = isEntrance ? baseLine : interpolateScalarBaseLine(baseLine, prevBaseLine, animationElapsedTime);
		baseLineAnimationState.syncStepValue(stepBaseLine, animationElapsedTime);
		return /*#__PURE__*/ import_react.createElement(AreaLabelListProvider, {
			showLabels: !isAnimating,
			points
		}, props.children, /*#__PURE__*/ import_react.createElement(StaticArea, {
			points: stepPoints,
			baseLine: stepBaseLine,
			needClip,
			clipPathId,
			props,
			animationElapsedTime,
			isAnimating: isAnimating || animationElapsedTime < 1,
			isEntrance
		}), /*#__PURE__*/ import_react.createElement(LabelListFromLabelProp, { label: props.label }));
	});
}
function RenderArea(_ref6) {
	var needClip = _ref6.needClip, clipPathId = _ref6.clipPathId, props = _ref6.props;
	var previousPointsRef = (0, import_react.useRef)(null);
	var previousBaselineRef = (0, import_react.useRef)();
	return /*#__PURE__*/ import_react.createElement(AreaWithAnimation, {
		needClip,
		clipPathId,
		props,
		previousPointsRef,
		previousBaselineRef
	});
}
var AreaWithState = class extends import_react.PureComponent {
	render() {
		var _this$props = this.props, hide = _this$props.hide, dot = _this$props.dot, points = _this$props.points, className = _this$props.className, top = _this$props.top, left = _this$props.left, needClip = _this$props.needClip, xAxisId = _this$props.xAxisId, yAxisId = _this$props.yAxisId, width = _this$props.width, height = _this$props.height, id = _this$props.id, baseLine = _this$props.baseLine, zIndex = _this$props.zIndex;
		if (hide) return null;
		var layerClass = clsx("recharts-area", className);
		var clipPathId = id;
		var _getRadiusAndStrokeWi = getRadiusAndStrokeWidthFromDot(dot), r = _getRadiusAndStrokeWi.r, strokeWidth = _getRadiusAndStrokeWi.strokeWidth;
		var clipDot = isClipDot(dot);
		var dotSize = r * 2 + strokeWidth;
		var activePointsClipPath = needClip ? "url(#clipPath-".concat(clipDot ? "" : "dots-").concat(clipPathId, ")") : void 0;
		return /*#__PURE__*/ import_react.createElement(ZIndexLayer, { zIndex }, /*#__PURE__*/ import_react.createElement(Layer, { className: layerClass }, needClip && /*#__PURE__*/ import_react.createElement("defs", null, /*#__PURE__*/ import_react.createElement(GraphicalItemClipPath, {
			clipPathId,
			xAxisId,
			yAxisId
		}), !clipDot && /*#__PURE__*/ import_react.createElement("clipPath", { id: "clipPath-dots-".concat(clipPathId) }, /*#__PURE__*/ import_react.createElement("rect", {
			x: left - dotSize / 2,
			y: top - dotSize / 2,
			width: width + dotSize,
			height: height + dotSize
		}))), /*#__PURE__*/ import_react.createElement(RenderArea, {
			needClip,
			clipPathId,
			props: this.props
		})), /*#__PURE__*/ import_react.createElement(ActivePoints, {
			points,
			mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
			itemDataKey: this.props.dataKey,
			activeDot: this.props.activeDot,
			clipPath: activePointsClipPath
		}), this.props.isRange && Array.isArray(baseLine) && /*#__PURE__*/ import_react.createElement(ActivePoints, {
			points: baseLine,
			mainColor: getLegendItemColor(this.props.stroke, this.props.fill),
			itemDataKey: this.props.dataKey,
			activeDot: this.props.activeDot,
			clipPath: activePointsClipPath
		}));
	}
};
function AreaImpl(props) {
	var _useAppSelector;
	var activeDot = props.activeDot, animationBegin = props.animationBegin, animationDuration = props.animationDuration, animationEasing = props.animationEasing, connectNulls = props.connectNulls, dot = props.dot, fill = props.fill, fillOpacity = props.fillOpacity, hide = props.hide, isAnimationActive = props.isAnimationActive, legendType = props.legendType, stroke = props.stroke, xAxisId = props.xAxisId, yAxisId = props.yAxisId, everythingElse = _objectWithoutProperties(props, _excluded2);
	var layout = useChartLayout();
	var chartName = useChartName();
	var needClip = useNeedsClip(xAxisId, yAxisId).needClip;
	var isPanorama = useIsPanorama();
	var _ref7 = (_useAppSelector = useAppSelector((state) => selectArea(state, props.id, isPanorama))) !== null && _useAppSelector !== void 0 ? _useAppSelector : {}, points = _ref7.points, isRange = _ref7.isRange, baseLine = _ref7.baseLine;
	var plotArea = usePlotArea();
	if (layout !== "horizontal" && layout !== "vertical" || plotArea == null) return null;
	if (chartName !== "AreaChart" && chartName !== "ComposedChart") return null;
	var height = plotArea.height, width = plotArea.width, left = plotArea.x, top = plotArea.y;
	if (!points || !points.length) return null;
	return /*#__PURE__*/ import_react.createElement(AreaWithState, _extends({}, everythingElse, {
		activeDot,
		animationBegin,
		animationDuration,
		animationEasing,
		baseLine,
		connectNulls,
		dot,
		fill,
		fillOpacity,
		height,
		hide,
		layout,
		isAnimationActive,
		isRange,
		legendType,
		needClip,
		points,
		stroke,
		width,
		left,
		top,
		xAxisId,
		yAxisId
	}));
}
var getBaseValue = (layout, chartBaseValue, itemBaseValue, xAxis, yAxis) => {
	var baseValue = itemBaseValue !== null && itemBaseValue !== void 0 ? itemBaseValue : chartBaseValue;
	if (isNumber(baseValue)) return baseValue;
	var numericAxis = layout === "horizontal" ? yAxis : xAxis;
	var domain = numericAxis.scale.domain();
	if (numericAxis.type === "number") {
		var domainMax = Math.max(domain[0], domain[1]);
		var domainMin = Math.min(domain[0], domain[1]);
		if (baseValue === "dataMin") return domainMin;
		if (baseValue === "dataMax") return domainMax;
		return domainMax < 0 ? domainMax : Math.max(Math.min(domain[0], domain[1]), 0);
	}
	if (baseValue === "dataMin") return domain[0];
	if (baseValue === "dataMax") return domain[1];
	return domain[0];
};
function computeArea(_ref8) {
	var _ref8$areaSettings = _ref8.areaSettings, connectNulls = _ref8$areaSettings.connectNulls, itemBaseValue = _ref8$areaSettings.baseValue, dataKey = _ref8$areaSettings.dataKey, stackedData = _ref8.stackedData, layout = _ref8.layout, chartBaseValue = _ref8.chartBaseValue, xAxis = _ref8.xAxis, yAxis = _ref8.yAxis, displayedData = _ref8.displayedData, dataStartIndex = _ref8.dataStartIndex, xAxisTicks = _ref8.xAxisTicks, yAxisTicks = _ref8.yAxisTicks, bandSize = _ref8.bandSize, stackDataKeys = _ref8.stackDataKeys;
	var hasStack = stackedData && stackedData.length;
	var baseValue = getBaseValue(layout, chartBaseValue, itemBaseValue, xAxis, yAxis);
	var isHorizontalLayout = layout === "horizontal";
	var isRange = false;
	var points = displayedData.map((entry, index) => {
		var _valueAsArray$, _valueAsArray, _xAxis$scale$map;
		var valueAsArray;
		if (hasStack) valueAsArray = stackedData[dataStartIndex + index];
		else {
			var _rawValue = getValueByDataKey(entry, dataKey);
			if (!Array.isArray(_rawValue)) valueAsArray = [baseValue, _rawValue];
			else {
				valueAsArray = _rawValue;
				isRange = true;
			}
		}
		var value1 = (_valueAsArray$ = (_valueAsArray = valueAsArray) === null || _valueAsArray === void 0 ? void 0 : _valueAsArray[1]) !== null && _valueAsArray$ !== void 0 ? _valueAsArray$ : null;
		var rawValue = getValueByDataKey(entry, dataKey);
		var wholeStackIsNull = hasStack && rawValue == null && stackDataKeys != null && stackDataKeys.length > 0 && stackDataKeys.every((key) => getValueByDataKey(entry, key) == null);
		var isBreakPoint = value1 == null || hasStack && !connectNulls && rawValue == null || wholeStackIsNull;
		if (isHorizontalLayout) {
			var _yAxis$scale$map;
			return {
				x: getCateCoordinateOfLine({
					axis: xAxis,
					ticks: xAxisTicks,
					bandSize,
					entry,
					index
				}),
				y: isBreakPoint ? null : (_yAxis$scale$map = yAxis.scale.map(value1)) !== null && _yAxis$scale$map !== void 0 ? _yAxis$scale$map : null,
				value: valueAsArray,
				payload: entry
			};
		}
		return {
			x: isBreakPoint ? null : (_xAxis$scale$map = xAxis.scale.map(value1)) !== null && _xAxis$scale$map !== void 0 ? _xAxis$scale$map : null,
			y: getCateCoordinateOfLine({
				axis: yAxis,
				ticks: yAxisTicks,
				bandSize,
				entry,
				index
			}),
			value: valueAsArray,
			payload: entry
		};
	});
	var baseLine;
	if (hasStack || isRange) baseLine = points.map((entry) => {
		var _xAxis$scale$map2;
		var x = Array.isArray(entry.value) ? entry.value[0] : null;
		if (isHorizontalLayout) {
			var _yAxis$scale$map2;
			return {
				x: entry.x,
				y: x != null && entry.y != null ? (_yAxis$scale$map2 = yAxis.scale.map(x)) !== null && _yAxis$scale$map2 !== void 0 ? _yAxis$scale$map2 : null : null,
				payload: entry.payload
			};
		}
		return {
			x: x != null ? (_xAxis$scale$map2 = xAxis.scale.map(x)) !== null && _xAxis$scale$map2 !== void 0 ? _xAxis$scale$map2 : null : null,
			y: entry.y,
			payload: entry.payload
		};
	});
	else baseLine = isHorizontalLayout ? yAxis.scale.map(baseValue) : xAxis.scale.map(baseValue);
	return {
		points,
		baseLine: baseLine !== null && baseLine !== void 0 ? baseLine : 0,
		isRange
	};
}
function AreaFn(outsideProps) {
	var props = resolveDefaultProps(outsideProps, defaultAreaProps);
	var isPanorama = useIsPanorama();
	return /*#__PURE__*/ import_react.createElement(RegisterGraphicalItemId, {
		id: props.id,
		type: "area"
	}, (id) => /*#__PURE__*/ import_react.createElement(import_react.Fragment, null, /*#__PURE__*/ import_react.createElement(SetLegendPayload, { legendPayload: computeLegendPayloadFromAreaData(props) }), /*#__PURE__*/ import_react.createElement(SetAreaTooltipEntrySettings, {
		dataKey: props.dataKey,
		data: props.data,
		stroke: props.stroke,
		strokeWidth: props.strokeWidth,
		fill: props.fill,
		name: props.name,
		hide: props.hide,
		unit: props.unit,
		formatter: props.formatter,
		tooltipType: props.tooltipType,
		id
	}), /*#__PURE__*/ import_react.createElement(SetCartesianGraphicalItem, {
		type: "area",
		id,
		data: props.data,
		dataKey: props.dataKey,
		xAxisId: props.xAxisId,
		yAxisId: props.yAxisId,
		zAxisId: 0,
		stackId: getNormalizedStackId(props.stackId),
		hide: props.hide,
		barSize: void 0,
		baseValue: props.baseValue,
		isPanorama,
		connectNulls: props.connectNulls
	}), /*#__PURE__*/ import_react.createElement(AreaImpl, _extends({}, props, { id }))));
}
/**
* @provides LabelListContext
* @consumes CartesianChartContext
*/
var Area = /*#__PURE__*/ import_react.memo(AreaFn, propsAreEqual);
Area.displayName = "Area";
//#endregion
//#region node_modules/recharts/es6/chart/AreaChart.js
var allowedTooltipTypes = ["axis"];
/**
* @consumes ResponsiveContainerContext
* @provides CartesianViewBoxContext
* @provides CartesianChartContext
*/
var AreaChart = /*#__PURE__*/ (0, import_react.forwardRef)((props, ref) => {
	return /*#__PURE__*/ import_react.createElement(CartesianChart, {
		chartName: "AreaChart",
		defaultTooltipEventType: "axis",
		validateTooltipEventTypes: allowedTooltipTypes,
		tooltipPayloadSearcher: arrayTooltipSearcher,
		categoricalChartProps: props,
		ref
	});
});
//#endregion
//#region src/components/DailyIncomeExpenseChart.tsx
var import_jsx_runtime = require_jsx_runtime();
var CustomTooltip = ({ active, payload, label, lang }) => {
	if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700 text-xs backdrop-blur-sm animate-in fade-in duration-150",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold text-slate-300 mb-1.5 border-b border-slate-700 pb-1",
			children: lang === "bn" ? `তারিখ: ${label}` : `Date: ${label}`
		}), payload.map((entry, index) => {
			entry.dataKey;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4 my-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 font-medium",
					style: { color: entry.color },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "w-2 h-2 rounded-full",
						style: { backgroundColor: entry.color }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [entry.name, ":"] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-extrabold font-mono text-white",
					children: formatCurrency(entry.value, lang)
				})]
			}, `item-${index}`);
		})]
	});
	return null;
};
var DailyIncomeExpenseChart = ({ transactions, lang, currentMonthIndex, currentYear }) => {
	const isBn = lang === "bn";
	const [chartType, setChartType] = (0, import_react.useState)("bar");
	const monthsBn = [
		"জানুয়ারি",
		"ফেব্রুয়ারি",
		"মার্চ",
		"এপ্রিল",
		"মে",
		"জুন",
		"জুলাই",
		"আগস্ট",
		"সেপ্টেম্বর",
		"অক্টোবর",
		"নভেম্বর",
		"ডিসেম্বর"
	];
	const dailyDataMap = {};
	transactions.filter((trx) => {
		if (trx.isDeleted) return false;
		if (currentMonthIndex !== void 0 && currentYear !== void 0) {
			const parts = (trx.date || "").split("-");
			if (parts.length >= 2) {
				const y = parseInt(parts[0], 10);
				const m = parseInt(parts[1], 10) - 1;
				return y === currentYear && m === currentMonthIndex;
			}
		}
		return true;
	}).forEach((trx) => {
		const parts = (trx.date || "").split("-");
		let dayNum = 1;
		if (parts.length >= 3) dayNum = parseInt(parts[2], 10);
		if (!dailyDataMap[dayNum]) {
			const monthNum = parts.length >= 2 ? parts[1] : "10";
			const labelStr = isBn ? `${toBengaliNumber(dayNum)}/${toBengaliNumber(monthNum)}` : `${monthNum}/${dayNum}`;
			dailyDataMap[dayNum] = {
				day: dayNum,
				dateStr: labelStr,
				income: 0,
				expense: 0
			};
		}
		if (trx.type === "income") dailyDataMap[dayNum].income += trx.amount;
		else dailyDataMap[dayNum].expense += trx.amount;
	});
	const chartData = Object.values(dailyDataMap).sort((a, b) => a.day - b.day).map((item) => ({
		label: item.dateStr,
		income: item.income,
		expense: item.expense
	}));
	const periodIncome = chartData.reduce((acc, curr) => acc + curr.income, 0);
	const periodExpense = chartData.reduce((acc, curr) => acc + curr.expense, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-all select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-3.5 flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
					className: "text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartNoAxesColumn, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "দৈনিক আয় ও ব্যয়ের তুলনামূলক চার্ট" : "Daily Income vs Expense Chart" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-500 dark:text-slate-400 mt-0.5",
					children: currentMonthIndex !== void 0 ? isBn ? `${monthsBn[currentMonthIndex]} মাসের দৈনন্দিন গ্রাফ` : `Daily breakdown for selected month` : isBn ? "সাম্প্রতিক সকল দিনের হিসাব" : "Recent daily overview"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setChartType("bar");
						},
						className: `px-2.5 py-1 rounded-lg transition-all ${chartType === "bar" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"}`,
						children: isBn ? "বার চার্ট" : "Bar"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setChartType("area");
						},
						className: `px-2.5 py-1 rounded-lg transition-all ${chartType === "area" ? "bg-white dark:bg-slate-900 text-[#E52E2E] shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"}`,
						children: isBn ? "ট্রেন্ড চার্ট" : "Trend"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-emerald-800 dark:text-emerald-300",
							children: isBn ? "মোট আয়" : "Total Income"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-extrabold text-emerald-700 dark:text-emerald-300 font-mono",
						children: formatCurrency(periodIncome, lang)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-6 h-6 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-rose-800 dark:text-rose-300",
							children: isBn ? "মোট ব্যয়" : "Total Expense"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-extrabold text-rose-700 dark:text-rose-300 font-mono",
						children: formatCurrency(periodExpense, lang)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "w-full h-56 pt-2",
				children: chartData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: chartType === "bar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: chartData,
						margin: {
							top: 10,
							right: 10,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false,
								stroke: "#e2e8f0",
								opacity: .6
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: {
									fontSize: 10,
									fill: "#64748b",
									fontWeight: 600
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 9,
									fill: "#64748b",
									fontWeight: 600
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (val) => `${val >= 1e3 ? `${(val / 1e3).toFixed(0)}k` : val}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, { lang }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								verticalAlign: "top",
								align: "right",
								iconType: "circle",
								wrapperStyle: {
									fontSize: 11,
									fontWeight: 700,
									paddingBottom: 10
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "income",
								name: isBn ? "দৈনিক আয়" : "Daily Income",
								fill: "#10b981",
								radius: [
									6,
									6,
									0,
									0
								],
								maxBarSize: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "expense",
								name: isBn ? "দৈনিক ব্যয়" : "Daily Expense",
								fill: "#ef4444",
								radius: [
									6,
									6,
									0,
									0
								],
								maxBarSize: 28
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
						data: chartData,
						margin: {
							top: 10,
							right: 10,
							left: -20,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "incomeGrad",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#10b981",
									stopOpacity: .4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#10b981",
									stopOpacity: 0
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
								id: "expenseGrad",
								x1: "0",
								y1: "0",
								x2: "0",
								y2: "1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "5%",
									stopColor: "#ef4444",
									stopOpacity: .4
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
									offset: "95%",
									stopColor: "#ef4444",
									stopOpacity: 0
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								vertical: false,
								stroke: "#e2e8f0",
								opacity: .6
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								tick: {
									fontSize: 10,
									fill: "#64748b",
									fontWeight: 600
								},
								axisLine: false,
								tickLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 9,
									fill: "#64748b",
									fontWeight: 600
								},
								axisLine: false,
								tickLine: false,
								tickFormatter: (val) => `${val >= 1e3 ? `${(val / 1e3).toFixed(0)}k` : val}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, { lang }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								verticalAlign: "top",
								align: "right",
								iconType: "circle",
								wrapperStyle: {
									fontSize: 11,
									fontWeight: 700,
									paddingBottom: 10
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "income",
								name: isBn ? "দৈনিক আয়" : "Daily Income",
								stroke: "#10b981",
								strokeWidth: 2.5,
								fillOpacity: 1,
								fill: "url(#incomeGrad)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
								type: "monotone",
								dataKey: "expense",
								name: isBn ? "দৈনিক ব্যয়" : "Daily Expense",
								stroke: "#ef4444",
								strokeWidth: 2.5,
								fillOpacity: 1,
								fill: "url(#expenseGrad)"
							})
						]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-600 text-xs font-medium",
					children: isBn ? "এই মাসে কোনো লেনদেন রেকর্ড নেই" : "No transactions recorded for this month"
				})
			})
		]
	});
};
//#endregion
//#region src/components/ReportModal.tsx
var MONTHS_BN = [
	"জানুয়ারি",
	"ফেব্রুয়ারি",
	"মার্চ",
	"এপ্রিল",
	"মে",
	"জুন",
	"জুলাই",
	"আগস্ট",
	"সেপ্টেম্বর",
	"অক্টোবর",
	"নভেম্বর",
	"ডিসেম্বর"
];
var MONTHS_SHORT_BN = [
	"জানু",
	"ফেব্রু",
	"মার্চ",
	"এপ্রি",
	"মে",
	"জুন",
	"জুলা",
	"আগ",
	"সেপ্টে",
	"অক্টো",
	"নভে",
	"ডিসে"
];
var MONTHS_EN = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var MONTHS_SHORT_EN = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var printHtmlViaIframe = (htmlContent) => {
	var _iframe$contentWindow;
	const iframe = document.createElement("iframe");
	iframe.style.position = "fixed";
	iframe.style.right = "0";
	iframe.style.bottom = "0";
	iframe.style.width = "0";
	iframe.style.height = "0";
	iframe.style.border = "0";
	document.body.appendChild(iframe);
	const doc = (_iframe$contentWindow = iframe.contentWindow) === null || _iframe$contentWindow === void 0 ? void 0 : _iframe$contentWindow.document;
	if (!doc) {
		document.body.removeChild(iframe);
		return;
	}
	doc.open();
	doc.write(htmlContent);
	doc.close();
	setTimeout(() => {
		try {
			var _iframe$contentWindow2, _iframe$contentWindow3;
			(_iframe$contentWindow2 = iframe.contentWindow) === null || _iframe$contentWindow2 === void 0 || _iframe$contentWindow2.focus();
			(_iframe$contentWindow3 = iframe.contentWindow) === null || _iframe$contentWindow3 === void 0 || _iframe$contentWindow3.print();
		} finally {
			setTimeout(() => {
				if (document.body.contains(iframe)) document.body.removeChild(iframe);
			}, 1500);
		}
	}, 350);
};
var ReportModal = ({ isOpen, transactions, lang, user, onClose, isTabMode = false, currentMonthIndex, currentYear, onPrevMonth, onNextMonth }) => {
	const isSubAdmin$1 = isSubAdmin(user);
	const [reportScope, setReportScope] = (0, import_react.useState)("own");
	const [reportPeriod, setReportPeriod] = (0, import_react.useState)("monthly");
	const [auditYear, setAuditYear] = (0, import_react.useState)(currentYear);
	(0, import_react.useEffect)(() => {
		setAuditYear(currentYear);
	}, [currentYear]);
	const isBn = lang === "bn";
	const scopedTransactions = (0, import_react.useMemo)(() => {
		const nonDeleted = transactions.filter((trx) => !trx.isDeleted);
		if (isSubAdmin$1 && reportScope === "own") return nonDeleted.filter((trx) => isTransactionOwner(trx, user));
		return nonDeleted;
	}, [
		transactions,
		isSubAdmin$1,
		reportScope,
		user
	]);
	const activeTransactions = (0, import_react.useMemo)(() => {
		return scopedTransactions.filter((trx) => {
			const parts = (trx.date || "").split("-");
			if (parts.length >= 2) {
				const y = parseInt(parts[0], 10);
				const m = parseInt(parts[1], 10) - 1;
				return y === currentYear && m === currentMonthIndex;
			}
			return true;
		});
	}, [
		scopedTransactions,
		currentYear,
		currentMonthIndex
	]);
	const { totalIncome, totalExpense, netBalance } = (0, import_react.useMemo)(() => {
		let inc = 0;
		let exp = 0;
		activeTransactions.forEach((trx) => {
			if (trx.type === "income") inc += trx.amount;
			else exp += trx.amount;
		});
		return {
			totalIncome: inc,
			totalExpense: exp,
			netBalance: inc - exp
		};
	}, [activeTransactions]);
	const yearlyData = (0, import_react.useMemo)(() => {
		const yearTrx = scopedTransactions.filter((trx) => {
			const parts = (trx.date || "").split("-");
			if (parts.length >= 1) return parseInt(parts[0], 10) === auditYear;
			return false;
		});
		const monthlyBreakdown = Array.from({ length: 12 }, (_, idx) => ({
			monthIndex: idx,
			monthBn: MONTHS_BN[idx],
			monthEn: MONTHS_EN[idx],
			shortLabel: isBn ? MONTHS_SHORT_BN[idx] : MONTHS_SHORT_EN[idx],
			income: 0,
			expense: 0,
			net: 0,
			count: 0
		}));
		const incomeCats = /* @__PURE__ */ new Map();
		const expenseCats = /* @__PURE__ */ new Map();
		let yIncome = 0;
		let yExpense = 0;
		yearTrx.forEach((trx) => {
			const parts = (trx.date || "").split("-");
			const mIdx = parts.length >= 2 ? parseInt(parts[1], 10) - 1 : 0;
			const bucket = monthlyBreakdown[mIdx >= 0 && mIdx < 12 ? mIdx : 0];
			const cat = trx.category || (trx.type === "income" ? "বিল কালেকশন" : "অফিস খরচ");
			if (trx.type === "income") {
				bucket.income += trx.amount;
				yIncome += trx.amount;
				incomeCats.set(cat, (incomeCats.get(cat) || 0) + trx.amount);
			} else {
				bucket.expense += trx.amount;
				yExpense += trx.amount;
				expenseCats.set(cat, (expenseCats.get(cat) || 0) + trx.amount);
			}
			bucket.count += 1;
		});
		monthlyBreakdown.forEach((m) => {
			m.net = m.income - m.expense;
		});
		const sortedIncomeCats = Array.from(incomeCats.entries()).map(([name, amount]) => ({
			name,
			amount
		})).sort((a, b) => b.amount - a.amount);
		const sortedExpenseCats = Array.from(expenseCats.entries()).map(([name, amount]) => ({
			name,
			amount
		})).sort((a, b) => b.amount - a.amount);
		const bestMonth = monthlyBreakdown.reduce((best, cur) => cur.income > best.income ? cur : best, monthlyBreakdown[0]);
		const yNet = yIncome - yExpense;
		const profitMargin = yIncome > 0 ? Math.round(yNet / yIncome * 100) : 0;
		return {
			transactions: yearTrx,
			monthlyBreakdown,
			totalIncome: yIncome,
			totalExpense: yExpense,
			netBalance: yNet,
			profitMargin,
			bestMonth,
			topExpenseCategory: sortedExpenseCats[0] || null,
			incomeCategories: sortedIncomeCats,
			expenseCategories: sortedExpenseCats
		};
	}, [
		scopedTransactions,
		auditYear,
		isBn
	]);
	if (!isOpen) return null;
	const formatNum = (n) => isBn ? toBengaliNumber(n) : n.toLocaleString("en-US");
	const getShortDateStr = (dateStr) => {
		if (!dateStr) return "১০/২৬";
		const parts = dateStr.split("-");
		if (parts.length >= 3) {
			const month = parts[1];
			const day = parts[2];
			return isBn ? `${toBengaliNumber(month)}/${toBengaliNumber(day)}` : `${month}/${day}`;
		}
		return dateStr;
	};
	const handleExportCsv = () => {
		sounds.playTap();
		let csv = "";
		let fileName = "";
		if (reportPeriod === "monthly") {
			csv = "﻿Date,Time,Transaction_ID,Person,Phone,Type,Method,Category,Income_Amount,Expense_Amount,Status,Note\n";
			activeTransactions.forEach((t) => {
				const isInc = t.type === "income";
				const incVal = isInc ? t.amount : "";
				const expVal = !isInc ? t.amount : "";
				const status = isInc ? "আয়" : "পরিশোধ";
				csv += `"${t.date}","${t.time}","${t.trxId}","${t.person || ""}","${t.phone || ""}","${t.type}","${t.method}","${t.category}","${incVal}","${expVal}","${status}","${(t.note || "").replace(/"/g, "\"\"")}"\n`;
			});
			fileName = `protyasha_monthly_audit_${MONTHS_EN[currentMonthIndex]}_${currentYear}.csv`;
		} else {
			csv = "﻿Month,Transactions_Count,Total_Income,Total_Expense,Net_Profit_Loss\n";
			yearlyData.monthlyBreakdown.forEach((m) => {
				csv += `"${m.monthEn} ${auditYear}","${m.count}","${m.income}","${m.expense}","${m.net}"\n`;
			});
			csv += `"TOTAL ${auditYear}","${yearlyData.transactions.length}","${yearlyData.totalIncome}","${yearlyData.totalExpense}","${yearlyData.netBalance}"\n`;
			fileName = `protyasha_yearly_audit_${auditYear}.csv`;
		}
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	};
	const handleExportExcel = () => {
		sounds.playSuccess();
		let tableHtml = "";
		let fileName = "";
		if (reportPeriod === "monthly") {
			tableHtml = `
        <table border="1">
          <tr><th colspan="8" style="font-size:16px;font-weight:bold;background:#f8fafc;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — মাসিক অডিট রিপোর্ট (${`${MONTHS_BN[currentMonthIndex]} ${toBengaliNumber(currentYear)}`})</th></tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>তারিখ</th>
            <th>ট্রানজেকশন আইডি</th>
            <th>খাত / বিবরণ</th>
            <th>ব্যক্তি / গ্রাহক</th>
            <th>মাধ্যম</th>
            <th>আয় (৳)</th>
            <th>ব্যয় (৳)</th>
            <th>নোট</th>
          </tr>
          ${activeTransactions.map((trx) => {
				const isInc = trx.type === "income";
				return `
            <tr>
              <td>${trx.date}</td>
              <td>${trx.trxId || "-"}</td>
              <td>${trx.category || (isInc ? "বিল কালেকশন" : "অফিস খরচ")}</td>
              <td>${trx.person || "-"}</td>
              <td>${trx.method || "-"}</td>
              <td style="color:#16a34a;font-weight:bold;">${isInc ? trx.amount : ""}</td>
              <td style="color:#dc2626;font-weight:bold;">${!isInc ? trx.amount : ""}</td>
              <td>${trx.note || ""}</td>
            </tr>`;
			}).join("")}
          <tr style="background:#f1f5f9;font-weight:bold;">
            <td colspan="5" align="right">মোট :</td>
            <td style="color:#16a34a;">${totalIncome}</td>
            <td style="color:#dc2626;">${totalExpense}</td>
            <td>নিট ব্যালেন্স: ${netBalance} টাকা</td>
          </tr>
        </table>`;
			fileName = `protyasha_monthly_audit_${MONTHS_EN[currentMonthIndex]}_${currentYear}.xls`;
		} else {
			const monthRows = yearlyData.monthlyBreakdown.map((m) => `
          <tr>
            <td>${m.monthBn} ${toBengaliNumber(auditYear)}</td>
            <td>${m.count}</td>
            <td style="color:#16a34a;font-weight:bold;">${m.income}</td>
            <td style="color:#dc2626;font-weight:bold;">${m.expense}</td>
            <td style="font-weight:bold;">${m.net}</td>
          </tr>`).join("");
			const catRows = [...yearlyData.incomeCategories.map((c) => `<tr><td>আয়</td><td>${c.name}</td><td style="color:#16a34a;font-weight:bold;">${c.amount}</td></tr>`), ...yearlyData.expenseCategories.map((c) => `<tr><td>ব্যয়</td><td>${c.name}</td><td style="color:#dc2626;font-weight:bold;">${c.amount}</td></tr>`)].join("");
			tableHtml = `
        <table border="1">
          <tr><th colspan="5" style="font-size:16px;font-weight:bold;background:#f8fafc;">প্রত্যাশা ক্যাবল নেটওয়ার্ক — বাৎসরিক অডিট রিপোর্ট (${toBengaliNumber(auditYear)})</th></tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>মাস</th>
            <th>লেনদেন সংখ্যা</th>
            <th>মোট আয় (৳)</th>
            <th>মোট ব্যয় (৳)</th>
            <th>নিট লাভ/ক্ষতি (৳)</th>
          </tr>
          ${monthRows}
          <tr style="background:#f1f5f9;font-weight:bold;">
            <td>বাৎসরিক সর্বমোট</td>
            <td>${yearlyData.transactions.length}</td>
            <td style="color:#16a34a;">${yearlyData.totalIncome}</td>
            <td style="color:#dc2626;">${yearlyData.totalExpense}</td>
            <td>${yearlyData.netBalance}</td>
          </tr>
        </table>
        <br/>
        <table border="1">
          <tr><th colspan="3" style="font-size:14px;font-weight:bold;background:#f8fafc;">খাতভিত্তিক বাৎসরিক বিবরণী (${toBengaliNumber(auditYear)})</th></tr>
          <tr style="background:#e2e8f0;font-weight:bold;">
            <th>ধরন</th>
            <th>খাতের নাম</th>
            <th>মোট পরিমাণ (৳)</th>
          </tr>
          ${catRows}
        </table>`;
			fileName = `protyasha_yearly_audit_${auditYear}.xls`;
		}
		const excelDoc = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="UTF-8" /></head>
      <body>${tableHtml}</body>
      </html>`;
		const blob = new Blob(["﻿" + excelDoc], { type: "application/vnd.ms-excel;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = fileName;
		a.click();
		URL.revokeObjectURL(url);
	};
	const handleDownloadPdf = () => {
		sounds.playSuccess();
		const scopePillHtml = isSubAdmin$1 ? `<div class="scope-pill">${reportScope === "own" ? `সাব-এডমিন নিজস্ব রিপোর্ট (${(user === null || user === void 0 ? void 0 : user.name) || ""})` : "সম্পূর্ণ প্রতিষ্ঠানের রিপোর্ট (সকল লেনদেন)"}</div>` : "";
		let bodyContent = "";
		let docTitle = "";
		if (reportPeriod === "monthly") {
			const monthStr = `${MONTHS_BN[currentMonthIndex]} ${toBengaliNumber(currentYear)}`;
			const dateRangeStr = `০১-${toBengaliNumber(new Date(currentYear, currentMonthIndex + 1, 0).getDate())}/${toBengaliNumber(currentMonthIndex + 1)}/${toBengaliNumber(currentYear)}`;
			docTitle = `প্রত্যাশা ক্যাবল নেটওয়ার্ক - মাসিক অডিট রিপোর্ট (${monthStr})`;
			let rowsHtml = "";
			activeTransactions.forEach((trx) => {
				const isInc = trx.type === "income";
				const shortDate = getShortDateStr(trx.date);
				const desc = trx.category || (isInc ? "বিল কালেকশন" : "অফিস খরচ");
				const ref = trx.note || trx.person || "-";
				const incAmt = isInc ? toBengaliNumber(trx.amount) : "";
				const expAmt = !isInc ? toBengaliNumber(trx.amount) : "";
				rowsHtml += `
          <tr>
            <td>${shortDate}</td>
            <td class="text-left">${desc}</td>
            <td>${ref}</td>
            <td class="text-right font-bold" style="color: #16a34a;">${incAmt}</td>
            <td class="text-right font-bold" style="color: #dc2626;">${expAmt}</td>
            <td class="font-bold">${isInc ? "আয়" : "পরিশোধ"}</td>
          </tr>`;
			});
			bodyContent = `
        <div class="meta-bar">
          <div>মাস : ${monthStr}</div>
          <div class="meta-title">মাসিক লেনদেন অডিট রিপোর্ট</div>
          <div>তারিখ : ${dateRangeStr}</div>
        </div>
        <div class="divider-line"></div>
        <div class="section-heading">বিস্তারিত লেনদেন তালিকা</div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">তারিখ</th>
              <th style="width: 28%;">বিবরণ</th>
              <th style="width: 22%;">রেফারেন্স</th>
              <th style="width: 14%;">আয়</th>
              <th style="width: 14%;">ব্যয়</th>
              <th style="width: 10%;">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml || `<tr><td colspan="6" style="padding: 20px; color: #64748b;">এই মাসে কোনো লেনদেন রেকর্ড নেই</td></tr>`}
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-weight: 800;">মোট :</td>
              <td style="text-align: right; font-weight: 800; color: #16a34a;">${toBengaliNumber(totalIncome)}</td>
              <td style="text-align: right; font-weight: 800; color: #dc2626;">${toBengaliNumber(totalExpense)}</td>
              <td style="font-weight: 800;">টাকা</td>
            </tr>
          </tbody>
        </table>
        <div class="summary-card">
          <div class="summary-card-title">টোটাল মাসিক আয় - ব্যয়</div>
          <div class="summary-row">
            <span>টোটাল আয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(totalIncome)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-row">
            <span>টোটাল ব্যয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(totalExpense)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-net-row">
            <span>মোট =</span>
            <div><span style="font-size: 18px; font-weight: 800; margin-right: 6px;">${toBengaliNumber(netBalance)}</span><span>টাকা</span></div>
          </div>
        </div>`;
		} else {
			const yearBn = toBengaliNumber(auditYear);
			docTitle = `প্রত্যাশা ক্যাবল নেটওয়ার্ক - বাৎসরিক অডিট রিপোর্ট (${yearBn})`;
			const monthRowsHtml = yearlyData.monthlyBreakdown.map((m) => `
          <tr>
            <td class="text-left font-bold">${m.monthBn} ${yearBn}</td>
            <td>${toBengaliNumber(m.count)}</td>
            <td class="text-right font-bold" style="color: #16a34a;">${toBengaliNumber(m.income)}</td>
            <td class="text-right font-bold" style="color: #dc2626;">${toBengaliNumber(m.expense)}</td>
            <td class="text-right font-bold" style="color: ${m.net >= 0 ? "#0f172a" : "#dc2626"};">${toBengaliNumber(m.net)}</td>
          </tr>`).join("");
			const expCatRows = yearlyData.expenseCategories.slice(0, 10).map((c) => `
          <tr>
            <td class="text-left">${c.name}</td>
            <td class="text-right font-bold" style="color:#dc2626;">৳${toBengaliNumber(c.amount)}</td>
          </tr>`).join("");
			bodyContent = `
        <div class="meta-bar">
          <div>অর্থবছর : ${yearBn}</div>
          <div class="meta-title">বাৎসরিক আর্থিক অডিট রিপোর্ট</div>
          <div>মোট এন্ট্রি : ${toBengaliNumber(yearlyData.transactions.length)} টি</div>
        </div>
        <div class="divider-line"></div>
        <div class="section-heading">১২ মাসের তুলনামূলক আয়-ব্যয় বিবরণী (${yearBn})</div>
        <table>
          <thead>
            <tr>
              <th style="width: 28%;">মাস</th>
              <th style="width: 14%;">লেনদেন</th>
              <th style="width: 20%;">মোট আয় (৳)</th>
              <th style="width: 20%;">মোট ব্যয় (৳)</th>
              <th style="width: 18%;">নিট লাভ/ক্ষতি (৳)</th>
            </tr>
          </thead>
          <tbody>
            ${monthRowsHtml}
            <tr class="total-row">
              <td class="text-left" style="font-weight: 800;">বাৎসরিক সর্বমোট :</td>
              <td>${toBengaliNumber(yearlyData.transactions.length)}</td>
              <td class="text-right" style="color: #16a34a;">${toBengaliNumber(yearlyData.totalIncome)}</td>
              <td class="text-right" style="color: #dc2626;">${toBengaliNumber(yearlyData.totalExpense)}</td>
              <td class="text-right">${toBengaliNumber(yearlyData.netBalance)}</td>
            </tr>
          </tbody>
        </table>
        ${expCatRows ? `<div class="section-heading">খাতভিত্তিক প্রধান ব্যয় বিবরণী</div>
               <table>
                 <thead><tr><th>খাতের নাম</th><th style="width:30%;">মোট ব্যয়</th></tr></thead>
                 <tbody>${expCatRows}</tbody>
               </table>` : ""}
        <div class="summary-card">
          <div class="summary-card-title">বাৎসরিক সারসংক্ষেপ (${yearBn})</div>
          <div class="summary-row">
            <span>বাৎসরিক মোট আয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(yearlyData.totalIncome)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-row">
            <span>বাৎসরিক মোট ব্যয় -</span>
            <div><span class="summary-val-box">${toBengaliNumber(yearlyData.totalExpense)}</span><span style="margin-left: 6px;">টাকা</span></div>
          </div>
          <div class="summary-net-row">
            <span>নিট ব্যালেন্স (${toBengaliNumber(yearlyData.profitMargin)}%) =</span>
            <div><span style="font-size: 18px; font-weight: 800; margin-right: 6px;">${toBengaliNumber(yearlyData.netBalance)}</span><span>টাকা</span></div>
          </div>
        </div>`;
		}
		printHtmlViaIframe(`
      <!DOCTYPE html>
      <html lang="bn">
      <head>
        <meta charset="UTF-8">
        <title>${docTitle}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700;800&display=swap');
          * { box-sizing: border-box; }
          body {
            font-family: 'Hind Siliguri', 'Kalpurush', Arial, sans-serif;
            margin: 0; padding: 24px; color: #0f172a; background: #ffffff;
            -webkit-print-color-adjust: exact; print-color-adjust: exact;
          }
          .header-container { text-align: center; margin-bottom: 12px; }
          .header-title { font-size: 28px; font-weight: 800; margin: 0; color: #000000; }
          .header-subtitle { font-size: 14px; color: #475569; margin-top: 4px; font-weight: 600; }
          .scope-pill {
            display: inline-block; margin-top: 6px; padding: 3px 10px; border-radius: 999px;
            background: #fef3c7; color: #92400e; font-size: 12px; font-weight: 700;
          }
          .divider-line { border-bottom: 1.5px solid #cbd5e1; margin: 14px 0; }
          .meta-bar { display: flex; justify-content: space-between; align-items: center; font-size: 14px; font-weight: 700; padding: 4px 0; }
          .meta-title { font-size: 18px; font-weight: 800; color: #0f172a; }
          .section-heading { font-size: 15px; font-weight: 700; margin: 16px 0 10px 0; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
          th, td { border: 1px solid #94a3b8; padding: 7px 10px; text-align: center; }
          th { background-color: #f1f5f9; font-weight: 700; color: #1e293b; font-size: 13.5px; }
          td.text-left { text-align: left; }
          td.text-right { text-align: right; }
          .font-bold { font-weight: 700; }
          .total-row { font-weight: 800; background-color: #f8fafc; font-size: 14px; }
          .summary-card {
            border: 1.5px solid #94a3b8; border-radius: 12px; padding: 16px 20px;
            width: 340px; margin-top: 10px; margin-bottom: 26px; background-color: #ffffff;
          }
          .summary-card-title { font-size: 16px; font-weight: 800; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1.5px solid #cbd5e1; }
          .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px; }
          .summary-val-box { border: 1px solid #cbd5e1; padding: 3px 12px; border-radius: 4px; font-weight: 700; min-width: 90px; text-align: center; }
          .summary-net-row {
            display: flex; justify-content: space-between; align-items: center; font-size: 15px;
            font-weight: 800; border-top: 2px solid #0f172a; padding-top: 8px; margin-top: 10px;
          }
          .footer-signature-bar {
            margin-top: 48px; display: flex; justify-content: space-between; align-items: flex-end;
            font-size: 13px; font-weight: 700; color: #334155;
          }
          .signature-box { text-align: center; }
          .signature-line { border-top: 1.5px solid #475569; width: 180px; margin-bottom: 6px; }
          @media print { body { padding: 12px; } }
        </style>
      </head>
      <body>
        <div class="header-container">
          <h1 class="header-title">প্রত্যাশা ক্যাবল নেটওয়ার্ক</h1>
          <div class="header-subtitle">ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার</div>
          ${scopePillHtml}
        </div>
        <div class="divider-line"></div>
        ${bodyContent}
        <div class="footer-signature-bar">
          <div>কম্পিউটার জেনারেটেড অডিট রিপোর্ট</div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div>কর্তৃপক্ষের স্বাক্ষর</div>
          </div>
        </div>
      </body>
      </html>`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: isTabMode ? "w-full min-h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 flex flex-col select-none pb-24" : "fixed inset-0 z-50 bg-slate-100 dark:bg-slate-950 flex flex-col select-none animate-in slide-in-from-right duration-200 pb-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 h-14 flex items-center justify-between shadow-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 min-w-0",
				children: [!isTabMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						sounds.playTap();
						onClose();
					},
					className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "w-5 h-5 stroke-[2.2]" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200/60 dark:border-rose-800/60 text-[#E52E2E] flex items-center justify-center font-bold shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-4 h-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-bold text-slate-900 dark:text-white leading-tight truncate",
							children: isBn ? "মাসিক ও বাৎসরিক অডিট রিপোর্ট" : "Monthly & Yearly Audit"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-slate-500 dark:text-slate-400 truncate",
							children: isBn ? "প্রত্যাশা ক্যাবল নেটওয়ার্ক হিসাব খাতা" : "Protasha Cable Network Audit"
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleExportExcel,
					className: "h-8 px-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer",
					title: "Excel",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline",
						children: "Excel"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleDownloadPdf,
					className: "h-8 px-3 rounded-full bg-[#E52E2E] hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer",
					title: isBn ? "পিডিএফ প্রিন্ট / ডাউনলোড" : "Print / Save PDF",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "PDF" : "PDF" })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 space-y-4 pb-28 w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-900 border border-slate-200 dark:border-slate-800",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setReportPeriod("monthly");
						},
						className: `h-10 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${reportPeriod === "monthly" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-3.5 h-3.5 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "মাসিক রিপোর্ট" : "Monthly Audit" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							sounds.playTap();
							setReportPeriod("yearly");
						},
						className: `h-10 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${reportPeriod === "yearly" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বাৎসরিক অডিট" : "Yearly Audit" })]
					})]
				}),
				reportPeriod === "monthly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onPrevMonth,
							className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-bold text-slate-900 dark:text-white tracking-wide",
								children: isBn ? `${MONTHS_BN[currentMonthIndex]} ${toBengaliNumber(currentYear)}` : `${MONTHS_EN[currentMonthIndex]} ${currentYear}`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onNextMonth,
							className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 stroke-[2.2]" })
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setAuditYear((y) => y - 1);
							},
							className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "w-5 h-5 stroke-[2.2]" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-extrabold text-slate-900 dark:text-white tracking-wide",
								children: isBn ? `অর্থবছর ${toBengaliNumber(auditYear)}` : `Fiscal Year ${auditYear}`
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setAuditYear((y) => y + 1);
							},
							className: "w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "w-5 h-5 stroke-[2.2]" })
						})
					]
				}),
				isSubAdmin$1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পিডিএফ ও রিপোর্ট ফিল্টার (সাব-এডমিন)" : "Report & PDF Scope (Sub-Admin)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] px-2 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200",
							children: reportScope === "own" ? isBn ? "আমার লেনদেন" : "My Entries" : isBn ? "সম্পূর্ণ হিসাব" : "Full Report"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-2 p-1 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-800/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setReportScope("own");
							},
							className: `py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${reportScope === "own" ? "bg-[#E52E2E] text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "শুধু আমার লেনদেন" : "My Transactions" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								sounds.playTap();
								setReportScope("all");
							},
							className: `py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${reportScope === "all" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "পুরো হিসাব (সকল)" : "All Transactions" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-12 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleDownloadPdf,
							className: "col-span-6 h-11 rounded-2xl bg-[#E52E2E] hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-rose-600/20 active:scale-98 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: reportPeriod === "monthly" ? isBn ? "মাসিক PDF প্রিন্ট" : "Monthly PDF" : isBn ? "বাৎসরিক PDF প্রিন্ট" : "Yearly PDF"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleExportExcel,
							className: "col-span-4 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 active:scale-98 transition-all cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-4 h-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Excel" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: handleExportCsv,
							className: "col-span-2 h-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1 active:scale-98 transition-all cursor-pointer",
							title: "CSV",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-3.5 h-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "CSV"
							})]
						})
					]
				}),
				reportPeriod === "monthly" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyIncomeExpenseChart, {
					transactions: scopedTransactions,
					lang,
					currentMonthIndex,
					currentYear
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-slate-900 dark:text-white overflow-x-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight",
								children: "প্রত্যাশা ক্যাবল নেটওয়ার্ক"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1",
								children: "ডিজিটাল ডিস ও ইন্টারনেট সার্ভিস প্রোভাইডার"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-2 border-slate-200 dark:border-slate-800 my-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 py-1 flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মাস : " }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-slate-900 dark:text-white",
									children: [
										MONTHS_BN[currentMonthIndex],
										" ",
										toBengaliNumber(currentYear)
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-base font-black text-slate-900 dark:text-white",
									children: "দৈনিক লেনদেন হিসাব"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "তারিখ : " }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"০১-",
									toBengaliNumber(new Date(currentYear, currentMonthIndex + 1, 0).getDate()),
									"/",
									toBengaliNumber(currentMonthIndex + 1),
									"/",
									toBengaliNumber(currentYear)
								] })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-b-2 border-slate-200 dark:border-slate-800 my-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "w-4 h-4 text-[#E52E2E]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "বিস্তারিত লেনদেন তালিকা" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs text-center border-collapse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 border-r border-slate-300 dark:border-slate-700 w-16",
											children: "তারিখ"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 border-r border-slate-300 dark:border-slate-700 text-left min-w-[140px]",
											children: "বিবরণ"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 border-r border-slate-300 dark:border-slate-700 min-w-[100px]",
											children: "রেফারেন্স"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 border-r border-slate-300 dark:border-slate-700 w-20",
											children: "আয়"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 border-r border-slate-300 dark:border-slate-700 w-20",
											children: "ব্যয়"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5 w-16",
											children: "স্ট্যাটাস"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
									className: "divide-y divide-slate-200 dark:divide-slate-800",
									children: [activeTransactions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 6,
										className: "p-6 text-center text-slate-400 font-medium",
										children: "এই মাসে কোনো লেনদেন সম্পন্ন হয়নি"
									}) }) : activeTransactions.map((trx) => {
										const isInc = trx.type === "income";
										const shortDate = getShortDateStr(trx.date);
										const desc = trx.category || (isInc ? "বিল কালেকশন" : "অফিস খরচ");
										const ref = trx.note || trx.person || "-";
										const incAmt = isInc ? toBengaliNumber(trx.amount) : "";
										const expAmt = !isInc ? toBengaliNumber(trx.amount) : "";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 font-mono text-slate-600 dark:text-slate-400",
													children: shortDate
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-left font-bold text-slate-900 dark:text-slate-100",
													children: desc
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400",
													children: ref
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums",
													children: incAmt
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums",
													children: expAmt
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 font-bold text-slate-700 dark:text-slate-300",
													children: isInc ? "আয়" : "পরিশোধ"
												})
											]
										}, trx.id);
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-slate-50 dark:bg-slate-800/80 font-extrabold text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 3,
												className: "p-2.5 text-right border-r border-slate-300 dark:border-slate-700",
												children: "মোট :"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 tabular-nums",
												children: toBengaliNumber(totalIncome)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400 tabular-nums",
												children: toBengaliNumber(totalExpense)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5 text-center",
												children: "টাকা"
											})
										]
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 p-4 rounded-2xl border-2 border-slate-300 dark:border-slate-700 max-w-xs bg-slate-50/50 dark:bg-slate-800/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-black text-slate-900 dark:text-white border-b border-slate-300 dark:border-slate-700 pb-2 mb-3",
								children: "টোটাল মাসিক আয় - ব্যয়"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-xs font-bold text-slate-800 dark:text-slate-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টোটাল আয় -" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-emerald-600 dark:text-emerald-400 tabular-nums",
												children: toBengaliNumber(totalIncome)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টাকা" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টোটাল ব্যয় -" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-rose-600 dark:text-rose-400 tabular-nums",
												children: toBengaliNumber(totalExpense)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টাকা" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t-2 border-slate-900 dark:border-slate-100 pt-2.5 mt-2 flex items-center justify-between text-sm font-black",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "মোট =" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-base text-slate-900 dark:text-white tabular-nums",
												children: toBengaliNumber(netBalance)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "টাকা" })]
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 pt-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 flex-wrap gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "কম্পিউটার জেনারেটেড রিপোর্ট" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-36 border-t border-slate-600 dark:border-slate-400 mb-1 mx-auto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "কর্তৃপক্ষের স্বাক্ষর" })]
							})]
						})
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বাৎসরিক আয়" : "Yearly Income" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1",
									children: ["৳", formatNum(yearlyData.totalIncome)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[11px] font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "বাৎসরিক ব্যয়" : "Yearly Expense" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1",
									children: ["৳", formatNum(yearlyData.totalExpense)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold text-indigo-600 dark:text-indigo-400",
									children: isBn ? "নিট লাভ / ব্যালেন্স" : "Net Balance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: `text-base sm:text-lg font-black tabular-nums mt-1 ${yearlyData.netBalance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`,
									children: ["৳", formatNum(yearlyData.netBalance)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-bold text-slate-500 dark:text-slate-400",
									children: isBn ? "লাভের হার / সর্বোচ্চ মাস" : "Margin / Top Month"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-base sm:text-lg font-black text-slate-900 dark:text-white tabular-nums mt-1",
									children: [
										formatNum(yearlyData.profitMargin),
										"%",
										yearlyData.bestMonth && yearlyData.bestMonth.income > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "ml-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400",
											children: [
												"(",
												isBn ? yearlyData.bestMonth.monthBn : yearlyData.bestMonth.monthEn,
												")"
											]
										})
									]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-extrabold text-slate-900 dark:text-white",
								children: isBn ? `১২ মাসের তুলনামূলক আয়-ব্যয় (${toBengaliNumber(auditYear)})` : `12-Month Income vs Expense (${auditYear})`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-slate-500 dark:text-slate-400",
								children: isBn ? "সবুজ = আয়, লাল = ব্যয়" : "Green = Income, Red = Expense"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: yearlyData.monthlyBreakdown,
									margin: {
										top: 8,
										right: 6,
										left: -16,
										bottom: 0
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "#94a3b8",
											strokeOpacity: .25
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "shortLabel",
											tick: {
												fontSize: 10,
												fill: "#64748b",
												fontWeight: 700
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											tick: {
												fontSize: 10,
												fill: "#64748b"
											},
											axisLine: false,
											tickLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											borderRadius: "12px",
											border: "1px solid #e2e8f0",
											fontSize: "12px",
											fontWeight: 700
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "income",
											name: isBn ? "আয়" : "Income",
											fill: "#10b981",
											radius: [
												4,
												4,
												0,
												0
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "expense",
											name: isBn ? "ব্যয়" : "Expense",
											fill: "#e11d48",
											radius: [
												4,
												4,
												0,
												0
											]
										})
									]
								})
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-lg sm:text-xl font-black text-slate-900 dark:text-white",
									children: [
										"প্রত্যাশা ক্যাবল নেটওয়ার্ক — বাৎসরিক অডিট (",
										toBengaliNumber(auditYear),
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5",
									children: isBn ? `মোট ${toBengaliNumber(yearlyData.transactions.length)}টি লেনদেনের পূর্ণাঙ্গ বিশ্লেষণ` : `Full audit across ${yearlyData.transactions.length} transactions`
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-xs text-center border-collapse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 border-r border-slate-300 dark:border-slate-700 text-left",
												children: "মাস"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 border-r border-slate-300 dark:border-slate-700 w-16",
												children: "এন্ট্রি"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 border-r border-slate-300 dark:border-slate-700 text-right",
												children: "আয় (৳)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 border-r border-slate-300 dark:border-slate-700 text-right",
												children: "ব্যয় (৳)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2.5 text-right",
												children: "নিট (৳)"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
										className: "divide-y divide-slate-200 dark:divide-slate-800",
										children: [yearlyData.monthlyBreakdown.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-slate-50 dark:hover:bg-slate-800/50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-left font-bold text-slate-900 dark:text-slate-100",
													children: isBn ? m.monthBn : m.monthEn
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 tabular-nums",
													children: formatNum(m.count)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-emerald-600 dark:text-emerald-400 tabular-nums",
													children: formatNum(m.income)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-200 dark:border-slate-800 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums",
													children: formatNum(m.expense)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: `p-2.5 text-right font-extrabold tabular-nums ${m.net >= 0 ? "text-slate-900 dark:text-white" : "text-rose-600 dark:text-rose-400"}`,
													children: formatNum(m.net)
												})
											]
										}, m.monthIndex)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "bg-slate-100/80 dark:bg-slate-800 font-black text-slate-900 dark:text-white border-t-2 border-slate-300 dark:border-slate-700",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-left border-r border-slate-300 dark:border-slate-700",
													children: "সর্বমোট :"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 border-r border-slate-300 dark:border-slate-700 tabular-nums",
													children: formatNum(yearlyData.transactions.length)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 tabular-nums",
													children: formatNum(yearlyData.totalIncome)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right border-r border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400 tabular-nums",
													children: formatNum(yearlyData.totalExpense)
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "p-2.5 text-right tabular-nums",
													children: formatNum(yearlyData.netBalance)
												})
											]
										})]
									})]
								})
							}),
							(yearlyData.incomeCategories.length > 0 || yearlyData.expenseCategories.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "খাতভিত্তিক বাৎসরিক আয়" : "Yearly Income by Category" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [yearlyData.incomeCategories.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-700 dark:text-slate-300 font-semibold truncate pr-2",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums shrink-0",
												children: ["৳", formatNum(c.amount)]
											})]
										}, c.name)), yearlyData.incomeCategories.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400",
											children: isBn ? "কোনো আয় নেই" : "No income"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "text-xs font-extrabold text-rose-800 dark:text-rose-300 flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-3.5 h-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isBn ? "খাতভিত্তিক বাৎসরিক ব্যয়" : "Yearly Expense by Category" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [yearlyData.expenseCategories.slice(0, 6).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-slate-700 dark:text-slate-300 font-semibold truncate pr-2",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-extrabold text-rose-700 dark:text-rose-400 tabular-nums shrink-0",
												children: ["৳", formatNum(c.amount)]
											})]
										}, c.name)), yearlyData.expenseCategories.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400",
											children: isBn ? "কোনো ব্যয় নেই" : "No expense"
										})]
									})]
								})]
							})
						]
					})
				] })
			]
		})]
	});
};
//#endregion
export { ReportModal };
