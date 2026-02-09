# VueUse Composables

> Auto-generated. Run `npx tsx skills/vueuse/scripts/generate-composables.ts` to update.

## '@Electron'

| Composable | Description | File |
| --- | --- | --- |
| useIpcRenderer | Provides ipcRenderer and all of its APIs with Vue reactiv... | [use-ipc-renderer.md](../composables/use-ipc-renderer.md) |
| useIpcRendererInvoke | Reactive ipcRenderer.invoke API result. Make asynchronous... | [use-ipc-renderer-invoke.md](../composables/use-ipc-renderer-invoke.md) |
| useIpcRendererOn | Use ipcRenderer.on with ease and ipcRenderer.removeListen... | [use-ipc-renderer-on.md](../composables/use-ipc-renderer-on.md) |
| useZoomFactor | Reactive WebFrame zoom factor. | [use-zoom-factor.md](../composables/use-zoom-factor.md) |
| useZoomLevel | Reactive WebFrame zoom level. | [use-zoom-level.md](../composables/use-zoom-level.md) |

## '@Firebase'

| Composable | Description | File |
| --- | --- | --- |
| useAuth | Reactive Firebase Auth binding. It provides a reactive an... | [use-auth.md](../composables/use-auth.md) |
| useFirestore | Reactive Firestore binding. Making it straightforward to ... | [use-firestore.md](../composables/use-firestore.md) |
| useRTDB | Reactive Firebase Realtime Database binding. Making it st... | [use-rtdb.md](../composables/use-rtdb.md) |

## '@Integrations'

| Composable | Description | File |
| --- | --- | --- |
| useAsyncValidator | Wrapper for . | [use-async-validator.md](../composables/use-async-validator.md) |
| useAxios | Wrapper for . | [use-axios.md](../composables/use-axios.md) |
| useChangeCase | Reactive wrapper for . | [use-change-case.md](../composables/use-change-case.md) |
| useCookies | Wrapper for . | [use-cookies.md](../composables/use-cookies.md) |
| useDrauu | Reactive instance for drauu. | [use-drauu.md](../composables/use-drauu.md) |
| useFocusTrap | Reactive wrapper for . | [use-focus-trap.md](../composables/use-focus-trap.md) |
| useFuse | Easily implement fuzzy search using a composable with Fus... | [use-fuse.md](../composables/use-fuse.md) |
| useIDBKeyval | Wrapper for . | [use-idbkeyval.md](../composables/use-idbkeyval.md) |
| useJwt | Wrapper for . | [use-jwt.md](../composables/use-jwt.md) |
| useNProgress | Reactive wrapper for . | [use-nprogress.md](../composables/use-nprogress.md) |
| useQRCode | Wrapper for . | [use-qrcode.md](../composables/use-qrcode.md) |
| useSortable | Wrapper for . | [use-sortable.md](../composables/use-sortable.md) |

## '@Math'

| Composable | Description | File |
| --- | --- | --- |
| createGenericProjection | Generic version of . Accepts a custom projector function ... | [create-generic-projection.md](../composables/create-generic-projection.md) |
| createProjection | Reactive numeric projection from one domain to another. | [create-projection.md](../composables/create-projection.md) |
| logicAnd | condition for refs. | [logic-and.md](../composables/logic-and.md) |
| logicNot | condition for ref. | [logic-not.md](../composables/logic-not.md) |
| logicOr | conditions for refs. | [logic-or.md](../composables/logic-or.md) |
| useAbs | Reactive . | [use-abs.md](../composables/use-abs.md) |
| useAverage | Get the average of an array reactively. | [use-average.md](../composables/use-average.md) |
| useCeil | Reactive | [use-ceil.md](../composables/use-ceil.md) |
| useClamp | Reactively clamp a value between two other values. | [use-clamp.md](../composables/use-clamp.md) |
| useFloor | Reactive . | [use-floor.md](../composables/use-floor.md) |
| useMath | Reactive methods. | [use-math.md](../composables/use-math.md) |
| useMax | Reactive . | [use-max.md](../composables/use-max.md) |
| useMin | Reactive . | [use-min.md](../composables/use-min.md) |
| usePrecision | Reactively set the precision of a number. | [use-precision.md](../composables/use-precision.md) |
| useProjection | Reactive numeric projection from one domain to another. | [use-projection.md](../composables/use-projection.md) |
| useRound | Reactive . | [use-round.md](../composables/use-round.md) |
| useSum | Get the sum of an array reactively | [use-sum.md](../composables/use-sum.md) |
| useTrunc | Reactive . | [use-trunc.md](../composables/use-trunc.md) |

## '@Router'

| Composable | Description | File |
| --- | --- | --- |
| useRouteHash | Shorthand for a reactive . | [use-route-hash.md](../composables/use-route-hash.md) |
| useRouteParams | Shorthand for a reactive . | [use-route-params.md](../composables/use-route-params.md) |
| useRouteQuery | Shorthand for a reactive . Updates the URL query paramete... | [use-route-query.md](../composables/use-route-query.md) |

## '@RxJS'

| Composable | Description | File |
| --- | --- | --- |
| from | Wrappers around RxJS's and to allow them to accept s. | [from.md](../composables/from.md) |
| toObserver | Sugar function to convert a into an RxJS Observer. | [to-observer.md](../composables/to-observer.md) |
| useExtractedObservable | Use an RxJS as extracted from one or more composables, re... | [use-extracted-observable.md](../composables/use-extracted-observable.md) |
| useObservable | Use an RxJS , return a , and automatically unsubscribe fr... | [use-observable.md](../composables/use-observable.md) |
| useSubject | Bind an RxJS to a and propagate value changes both ways. | [use-subject.md](../composables/use-subject.md) |
| useSubscription | Use an RxJS without worrying about unsubscribing from it ... | [use-subscription.md](../composables/use-subscription.md) |
| watchExtractedObservable | Watch the values of an RxJS as extracted from one or more... | [watch-extracted-observable.md](../composables/watch-extracted-observable.md) |

## Animation

| Composable | Description | File |
| --- | --- | --- |
| useAnimate | Reactive Web Animations API. | [use-animate.md](../composables/use-animate.md) |
| useInterval | Reactive counter that increases on every interval. | [use-interval.md](../composables/use-interval.md) |
| useIntervalFn | Wrapper for with controls | [use-interval-fn.md](../composables/use-interval-fn.md) |
| useNow | Reactive current Date instance. | [use-now.md](../composables/use-now.md) |
| useRafFn | Call function on every . With controls of pausing and res... | [use-raf-fn.md](../composables/use-raf-fn.md) |
| useTimeout | Reactive value that becomes after a given time. | [use-timeout.md](../composables/use-timeout.md) |
| useTimeoutFn | Wrapper for with controls. | [use-timeout-fn.md](../composables/use-timeout-fn.md) |
| useTimestamp | Reactive current timestamp | [use-timestamp.md](../composables/use-timestamp.md) |
| useTransition | Transition between values | [use-transition.md](../composables/use-transition.md) |

## Array

| Composable | Description | File |
| --- | --- | --- |
| useArrayDifference | Reactive get array difference of two arrays. | [use-array-difference.md](../composables/use-array-difference.md) |
| useArrayEvery | Reactive | [use-array-every.md](../composables/use-array-every.md) |
| useArrayFilter | Reactive | [use-array-filter.md](../composables/use-array-filter.md) |
| useArrayFind | Reactive . | [use-array-find.md](../composables/use-array-find.md) |
| useArrayFindIndex | Reactive | [use-array-find-index.md](../composables/use-array-find-index.md) |
| useArrayFindLast | Reactive . | [use-array-find-last.md](../composables/use-array-find-last.md) |
| useArrayIncludes | Reactive | [use-array-includes.md](../composables/use-array-includes.md) |
| useArrayJoin | Reactive | [use-array-join.md](../composables/use-array-join.md) |
| useArrayMap | Reactive | [use-array-map.md](../composables/use-array-map.md) |
| useArrayReduce | Reactive . | [use-array-reduce.md](../composables/use-array-reduce.md) |
| useArraySome | Reactive | [use-array-some.md](../composables/use-array-some.md) |
| useArrayUnique | reactive unique array | [use-array-unique.md](../composables/use-array-unique.md) |
| useSorted | reactive sort array | [use-sorted.md](../composables/use-sorted.md) |

## Browser

| Composable | Description | File |
| --- | --- | --- |
| useBluetooth | Reactive Web Bluetooth API. Provides the ability to conne... | [use-bluetooth.md](../composables/use-bluetooth.md) |
| useBreakpoints | Reactive viewport breakpoints. | [use-breakpoints.md](../composables/use-breakpoints.md) |
| useBroadcastChannel | Reactive BroadcastChannel API. | [use-broadcast-channel.md](../composables/use-broadcast-channel.md) |
| useBrowserLocation | Reactive browser location | [use-browser-location.md](../composables/use-browser-location.md) |
| useClipboard | Reactive Clipboard API. Provides the ability to respond t... | [use-clipboard.md](../composables/use-clipboard.md) |
| useClipboardItems | Reactive Clipboard API. Provides the ability to respond t... | [use-clipboard-items.md](../composables/use-clipboard-items.md) |
| useColorMode | Reactive color mode (dark / light / customs) with auto da... | [use-color-mode.md](../composables/use-color-mode.md) |
| useCssSupports | SSR compatible and reactive . | [use-css-supports.md](../composables/use-css-supports.md) |
| useCssVar | Manipulate CSS variables | [use-css-var.md](../composables/use-css-var.md) |
| useDark | Reactive dark mode with auto data persistence. | [use-dark.md](../composables/use-dark.md) |
| useEventListener | Use EventListener with ease. Register using addEventListe... | [use-event-listener.md](../composables/use-event-listener.md) |
| useEyeDropper | Reactive EyeDropper API | [use-eye-dropper.md](../composables/use-eye-dropper.md) |
| useFavicon | Reactive favicon | [use-favicon.md](../composables/use-favicon.md) |
| useFileDialog | Open file dialog with ease. | [use-file-dialog.md](../composables/use-file-dialog.md) |
| useFileSystemAccess | Create and read and write local files with FileSystemAcce... | [use-file-system-access.md](../composables/use-file-system-access.md) |
| useFullscreen | Reactive Fullscreen API. It adds methods to present a spe... | [use-fullscreen.md](../composables/use-fullscreen.md) |
| useGamepad | Provides reactive bindings for the Gamepad API. | [use-gamepad.md](../composables/use-gamepad.md) |
| useImage | Reactive load an image in the browser, you can wait the r... | [use-image.md](../composables/use-image.md) |
| useMediaControls | Reactive media controls for both and elements | [use-media-controls.md](../composables/use-media-controls.md) |
| useMediaQuery | Reactive Media Query. Once you've created a MediaQueryLis... | [use-media-query.md](../composables/use-media-query.md) |
| useMemory | Reactive Memory Info. | [use-memory.md](../composables/use-memory.md) |
| useObjectUrl | Reactive URL representing an object. | [use-object-url.md](../composables/use-object-url.md) |
| usePerformanceObserver | Observe performance metrics. | [use-performance-observer.md](../composables/use-performance-observer.md) |
| usePermission | Reactive Permissions API. The Permissions API provides th... | [use-permission.md](../composables/use-permission.md) |
| usePreferredColorScheme | Reactive prefers-color-scheme media query. | [use-preferred-color-scheme.md](../composables/use-preferred-color-scheme.md) |
| usePreferredContrast | Reactive prefers-contrast media query. | [use-preferred-contrast.md](../composables/use-preferred-contrast.md) |
| usePreferredDark | Reactive dark theme preference. | [use-preferred-dark.md](../composables/use-preferred-dark.md) |
| usePreferredLanguages | Reactive Navigator Languages. It provides web developers ... | [use-preferred-languages.md](../composables/use-preferred-languages.md) |
| usePreferredReducedMotion | Reactive prefers-reduced-motion media query. | [use-preferred-reduced-motion.md](../composables/use-preferred-reduced-motion.md) |
| usePreferredReducedTransparency | Reactive prefers-reduced-transparency media query. | [use-preferred-reduced-transparency.md](../composables/use-preferred-reduced-transparency.md) |
| useScreenOrientation | Reactive Screen Orientation API. It provides web develope... | [use-screen-orientation.md](../composables/use-screen-orientation.md) |
| useScreenSafeArea | Reactive | [use-screen-safe-area.md](../composables/use-screen-safe-area.md) |
| useScriptTag | Creates a script tag, with support for automatically unlo... | [use-script-tag.md](../composables/use-script-tag.md) |
| useShare | Reactive Web Share API. The Browser provides features tha... | [use-share.md](../composables/use-share.md) |
| useSSRWidth | Used to set a global viewport width which will be used wh... | [use-ssrwidth.md](../composables/use-ssrwidth.md) |
| useStyleTag | Inject reactive element in head. | [use-style-tag.md](../composables/use-style-tag.md) |
| useTextareaAutosize | Automatically update the height of a textarea depending o... | [use-textarea-autosize.md](../composables/use-textarea-autosize.md) |
| useTextDirection | Reactive dir of the element's text. | [use-text-direction.md](../composables/use-text-direction.md) |
| useTitle | Reactive document title. | [use-title.md](../composables/use-title.md) |
| useUrlSearchParams | Reactive URLSearchParams | [use-url-search-params.md](../composables/use-url-search-params.md) |
| useVibrate | Reactive Vibration API | [use-vibrate.md](../composables/use-vibrate.md) |
| useWakeLock | Reactive Screen Wake Lock API. Provides a way to prevent ... | [use-wake-lock.md](../composables/use-wake-lock.md) |
| useWebNotification | Reactive Notification | [use-web-notification.md](../composables/use-web-notification.md) |
| useWebWorker | Simple Web Workers registration and communication. | [use-web-worker.md](../composables/use-web-worker.md) |
| useWebWorkerFn | Run expensive functions without blocking the UI, using a ... | [use-web-worker-fn.md](../composables/use-web-worker-fn.md) |

## Component

| Composable | Description | File |
| --- | --- | --- |
| computedInject | Combine and . Useful for creating a computed property bas... | [computed-inject.md](../composables/computed-inject.md) |
| createReusableTemplate | Define and reuse template inside the component scope. | [create-reusable-template.md](../composables/create-reusable-template.md) |
| createTemplatePromise | Template as Promise. Useful for constructing custom Dialo... | [create-template-promise.md](../composables/create-template-promise.md) |
| templateRef |  | [template-ref.md](../composables/template-ref.md) |
| tryOnBeforeMount | Safe . Call if it's inside a component lifecycle, if not,... | [try-on-before-mount.md](../composables/try-on-before-mount.md) |
| tryOnBeforeUnmount | Safe . Call if it's inside a component lifecycle, if not,... | [try-on-before-unmount.md](../composables/try-on-before-unmount.md) |
| tryOnMounted | Safe . Call if it's inside a component lifecycle, if not,... | [try-on-mounted.md](../composables/try-on-mounted.md) |
| tryOnScopeDispose | Safe . Call if it's inside an effect scope lifecycle, if ... | [try-on-scope-dispose.md](../composables/try-on-scope-dispose.md) |
| tryOnUnmounted | Safe . Call if it's inside a component lifecycle, if not,... | [try-on-unmounted.md](../composables/try-on-unmounted.md) |
| unrefElement | Retrieves the underlying DOM element from a Vue ref or co... | [unref-element.md](../composables/unref-element.md) |
| useCurrentElement | Get the DOM element of current component as a ref. | [use-current-element.md](../composables/use-current-element.md) |
| useMounted | Mounted state in ref. | [use-mounted.md](../composables/use-mounted.md) |
| useTemplateRefsList | Shorthand for binding refs to template elements and compo... | [use-template-refs-list.md](../composables/use-template-refs-list.md) |
| useVirtualList |  | [use-virtual-list.md](../composables/use-virtual-list.md) |
| useVModel | Shorthand for v-model binding, props + emit -> ref | [use-vmodel.md](../composables/use-vmodel.md) |
| useVModels | Shorthand for props v-model binding. Think it like but ch... | [use-vmodels.md](../composables/use-vmodels.md) |

## Elements

| Composable | Description | File |
| --- | --- | --- |
| useActiveElement | Reactive . Returns a shallow ref that updates when focus ... | [use-active-element.md](../composables/use-active-element.md) |
| useDocumentVisibility | Reactively track | [use-document-visibility.md](../composables/use-document-visibility.md) |
| useDraggable | Make elements draggable. | [use-draggable.md](../composables/use-draggable.md) |
| useDropZone | Create a zone where files can be dropped. | [use-drop-zone.md](../composables/use-drop-zone.md) |
| useElementBounding | Reactive bounding box of an HTML element | [use-element-bounding.md](../composables/use-element-bounding.md) |
| useElementSize | Reactive size of an HTML element. ResizeObserver MDN | [use-element-size.md](../composables/use-element-size.md) |
| useElementVisibility | Tracks the visibility of an element within the viewport. | [use-element-visibility.md](../composables/use-element-visibility.md) |
| useIntersectionObserver | Detects that a target element's visibility. | [use-intersection-observer.md](../composables/use-intersection-observer.md) |
| useMouseInElement | Reactive mouse position related to an element | [use-mouse-in-element.md](../composables/use-mouse-in-element.md) |
| useMutationObserver | Watch for changes being made to the DOM tree. MutationObs... | [use-mutation-observer.md](../composables/use-mutation-observer.md) |
| useParentElement | Get parent element of the given element | [use-parent-element.md](../composables/use-parent-element.md) |
| useResizeObserver | Reports changes to the dimensions of an Element's content... | [use-resize-observer.md](../composables/use-resize-observer.md) |
| useWindowFocus | Reactively track window focus with and events. | [use-window-focus.md](../composables/use-window-focus.md) |
| useWindowScroll | Reactive window scroll | [use-window-scroll.md](../composables/use-window-scroll.md) |
| useWindowSize | Reactive window size | [use-window-size.md](../composables/use-window-size.md) |

## Network

| Composable | Description | File |
| --- | --- | --- |
| useEventSource | An EventSource or Server-Sent-Events instance opens a per... | [use-event-source.md](../composables/use-event-source.md) |
| useFetch | Reactive Fetch API provides the ability to abort requests... | [use-fetch.md](../composables/use-fetch.md) |
| useWebSocket | Reactive WebSocket client. | [use-web-socket.md](../composables/use-web-socket.md) |

## Reactivity

| Composable | Description | File |
| --- | --- | --- |
| computedAsync | Computed for async functions. | [computed-async.md](../composables/computed-async.md) |
| computedEager | Eager computed without lazy evaluation. | [computed-eager.md](../composables/computed-eager.md) |
| computedWithControl | Explicitly define the dependencies of computed. | [computed-with-control.md](../composables/computed-with-control.md) |
| createRef | Returns a or depending on the param. | [create-ref.md](../composables/create-ref.md) |
| extendRef | Add extra attributes to Ref. | [extend-ref.md](../composables/extend-ref.md) |
| reactify | Converts plain functions into reactive functions. The con... | [reactify.md](../composables/reactify.md) |
| reactifyObject | Apply to an object | [reactify-object.md](../composables/reactify-object.md) |
| reactiveComputed | Computed reactive object. Instead of returning a ref that... | [reactive-computed.md](../composables/reactive-computed.md) |
| reactiveOmit | Reactively omit fields from a reactive object. | [reactive-omit.md](../composables/reactive-omit.md) |
| reactivePick | Reactively pick fields from a reactive object. | [reactive-pick.md](../composables/reactive-pick.md) |
| refAutoReset | A ref which will be reset to the default value after some... | [ref-auto-reset.md](../composables/ref-auto-reset.md) |
| refDebounced | Debounce execution of a ref value. | [ref-debounced.md](../composables/ref-debounced.md) |
| refDefault | Apply default value to a ref. | [ref-default.md](../composables/ref-default.md) |
| refManualReset | Create a ref with manual reset functionality. | [ref-manual-reset.md](../composables/ref-manual-reset.md) |
| refThrottled | Throttle changing of a ref value. | [ref-throttled.md](../composables/ref-throttled.md) |
| refWithControl | Fine-grained controls over ref and its reactivity. | [ref-with-control.md](../composables/ref-with-control.md) |
| syncRef | Two-way refs synchronization. | [sync-ref.md](../composables/sync-ref.md) |
| syncRefs | Keep target refs in sync with a source ref | [sync-refs.md](../composables/sync-refs.md) |
| toReactive | Converts ref to reactive. Also made possible to create a ... | [to-reactive.md](../composables/to-reactive.md) |
| toRef | Normalize value/ref/getter to or . | [to-ref.md](../composables/to-ref.md) |
| toRefs | Extended that also accepts refs of an object. | [to-refs.md](../composables/to-refs.md) |

## Sensors

| Composable | Description | File |
| --- | --- | --- |
| onClickOutside | Listen for clicks outside of an element. Useful for modal... | [on-click-outside.md](../composables/on-click-outside.md) |
| onElementRemoval | Fires when the element or any element containing it is re... | [on-element-removal.md](../composables/on-element-removal.md) |
| onKeyStroke | Listen for keyboard keystrokes. By default, listens on ev... | [on-key-stroke.md](../composables/on-key-stroke.md) |
| onLongPress | Listen for a long press on an element. Returns a stop fun... | [on-long-press.md](../composables/on-long-press.md) |
| onStartTyping | Fires when users start typing on non-editable elements. U... | [on-start-typing.md](../composables/on-start-typing.md) |
| useBattery | Reactive Battery Status API, more often referred to as th... | [use-battery.md](../composables/use-battery.md) |
| useDeviceMotion | Reactive DeviceMotionEvent. Provide web developers with i... | [use-device-motion.md](../composables/use-device-motion.md) |
| useDeviceOrientation | Reactive DeviceOrientationEvent. Provide web developers w... | [use-device-orientation.md](../composables/use-device-orientation.md) |
| useDevicePixelRatio | Reactively track | [use-device-pixel-ratio.md](../composables/use-device-pixel-ratio.md) |
| useDevicesList | Reactive enumerateDevices listing available input/output ... | [use-devices-list.md](../composables/use-devices-list.md) |
| useDisplayMedia | Reactive streaming. | [use-display-media.md](../composables/use-display-media.md) |
| useElementByPoint | Reactive element by point. | [use-element-by-point.md](../composables/use-element-by-point.md) |
| useElementHover | Reactive element's hover state. | [use-element-hover.md](../composables/use-element-hover.md) |
| useFocus | Reactive utility to track or set the focus state of a DOM... | [use-focus.md](../composables/use-focus.md) |
| useFocusWithin | Reactive utility to track if an element or one of its dec... | [use-focus-within.md](../composables/use-focus-within.md) |
| useFps | Reactive FPS (frames per second). | [use-fps.md](../composables/use-fps.md) |
| useGeolocation | Reactive Geolocation API. It allows the user to provide t... | [use-geolocation.md](../composables/use-geolocation.md) |
| useIdle | Tracks whether the user is being inactive. | [use-idle.md](../composables/use-idle.md) |
| useInfiniteScroll | Infinite scrolling of the element. | [use-infinite-scroll.md](../composables/use-infinite-scroll.md) |
| useKeyModifier | Reactive Modifier State. Tracks state of any of the suppo... | [use-key-modifier.md](../composables/use-key-modifier.md) |
| useMagicKeys | Reactive keys pressed state, with magical keys combinatio... | [use-magic-keys.md](../composables/use-magic-keys.md) |
| useMouse | Reactive mouse position | [use-mouse.md](../composables/use-mouse.md) |
| useMousePressed | Reactive mouse pressing state. Triggered by on target ele... | [use-mouse-pressed.md](../composables/use-mouse-pressed.md) |
| useNavigatorLanguage | Reactive navigator.language. | [use-navigator-language.md](../composables/use-navigator-language.md) |
| useNetwork | Reactive Network status. The Network Information API prov... | [use-network.md](../composables/use-network.md) |
| useOnline | Reactive online state. A wrapper of . | [use-online.md](../composables/use-online.md) |
| usePageLeave | Reactive state to show whether the mouse leaves the page. | [use-page-leave.md](../composables/use-page-leave.md) |
| useParallax | Create parallax effect easily. It uses and fallback to if... | [use-parallax.md](../composables/use-parallax.md) |
| usePointer | Reactive pointer state. | [use-pointer.md](../composables/use-pointer.md) |
| usePointerLock | Reactive pointer lock. | [use-pointer-lock.md](../composables/use-pointer-lock.md) |
| usePointerSwipe | Reactive swipe detection based on PointerEvents. | [use-pointer-swipe.md](../composables/use-pointer-swipe.md) |
| useScroll | Reactive scroll position and state. | [use-scroll.md](../composables/use-scroll.md) |
| useScrollLock | Lock scrolling of the element. | [use-scroll-lock.md](../composables/use-scroll-lock.md) |
| useSpeechRecognition | Reactive SpeechRecognition. | [use-speech-recognition.md](../composables/use-speech-recognition.md) |
| useSpeechSynthesis | Reactive SpeechSynthesis. | [use-speech-synthesis.md](../composables/use-speech-synthesis.md) |
| useSwipe | Reactive swipe detection based on . | [use-swipe.md](../composables/use-swipe.md) |
| useTextSelection | Reactively track user text selection based on . | [use-text-selection.md](../composables/use-text-selection.md) |
| useUserMedia | Reactive streaming. | [use-user-media.md](../composables/use-user-media.md) |

## State

| Composable | Description | File |
| --- | --- | --- |
| createGlobalState | Keep states in the global scope to be reusable across Vue... | [create-global-state.md](../composables/create-global-state.md) |
| createInjectionState | Create global state that can be injected into components. | [create-injection-state.md](../composables/create-injection-state.md) |
| createSharedComposable | Make a composable function usable with multiple Vue insta... | [create-shared-composable.md](../composables/create-shared-composable.md) |
| injectLocal | Extended with ability to call to provide the value in the... | [inject-local.md](../composables/inject-local.md) |
| provideLocal | Extended with ability to call to obtain the value in the ... | [provide-local.md](../composables/provide-local.md) |
| useAsyncState | Reactive async state. Will not block your setup function ... | [use-async-state.md](../composables/use-async-state.md) |
| useDebouncedRefHistory | Shorthand for with debounced filter. | [use-debounced-ref-history.md](../composables/use-debounced-ref-history.md) |
| useLastChanged | Records the timestamp of the last change | [use-last-changed.md](../composables/use-last-changed.md) |
| useLocalStorage | Reactive LocalStorage. | [use-local-storage.md](../composables/use-local-storage.md) |
| useManualRefHistory | Manually track the change history of a ref when the using... | [use-manual-ref-history.md](../composables/use-manual-ref-history.md) |
| useRefHistory | Track the change history of a ref, also provides undo and... | [use-ref-history.md](../composables/use-ref-history.md) |
| useSessionStorage | Reactive SessionStorage. | [use-session-storage.md](../composables/use-session-storage.md) |
| useStorage | Create a reactive ref that can be used to access & modify... | [use-storage.md](../composables/use-storage.md) |
| useStorageAsync | Reactive Storage in with async support. | [use-storage-async.md](../composables/use-storage-async.md) |
| useThrottledRefHistory | Shorthand for with throttled filter. | [use-throttled-ref-history.md](../composables/use-throttled-ref-history.md) |

## Time

| Composable | Description | File |
| --- | --- | --- |
| useCountdown | Reactive countdown timer in seconds. | [use-countdown.md](../composables/use-countdown.md) |
| useDateFormat | Get the formatted date according to the string of tokens ... | [use-date-format.md](../composables/use-date-format.md) |
| useTimeAgo | Reactive time ago. Automatically update the time ago stri... | [use-time-ago.md](../composables/use-time-ago.md) |
| useTimeAgoIntl | Reactive time ago with i18n supported. Automatically upda... | [use-time-ago-intl.md](../composables/use-time-ago-intl.md) |

## Utilities

| Composable | Description | File |
| --- | --- | --- |
| createEventHook | Utility for creating event hooks | [create-event-hook.md](../composables/create-event-hook.md) |
| createUnrefFn | Make a plain function accepting ref and raw values as arg... | [create-unref-fn.md](../composables/create-unref-fn.md) |
| get | Shorthand for accessing | [get.md](../composables/get.md) |
| isDefined | Non-nullish checking type guard for Ref. | [is-defined.md](../composables/is-defined.md) |
| makeDestructurable | Make isomorphic destructurable for object and array at th... | [make-destructurable.md](../composables/make-destructurable.md) |
| set | Shorthand for | [set.md](../composables/set.md) |
| useAsyncQueue | Executes each asynchronous task sequentially and passes t... | [use-async-queue.md](../composables/use-async-queue.md) |
| useBase64 | Reactive base64 transforming. Supports plain text, buffer... | [use-base64.md](../composables/use-base64.md) |
| useCached | Cache a ref with a custom comparator. | [use-cached.md](../composables/use-cached.md) |
| useCloned | Reactive clone of a ref. By default, it use to do the clone. | [use-cloned.md](../composables/use-cloned.md) |
| useConfirmDialog | Creates event hooks to support modals and confirmation di... | [use-confirm-dialog.md](../composables/use-confirm-dialog.md) |
| useCounter | Basic counter with utility functions. | [use-counter.md](../composables/use-counter.md) |
| useCycleList | Cycle through a list of items. | [use-cycle-list.md](../composables/use-cycle-list.md) |
| useDebounceFn | Debounce execution of a function. | [use-debounce-fn.md](../composables/use-debounce-fn.md) |
| useEventBus | A basic event bus. | [use-event-bus.md](../composables/use-event-bus.md) |
| useMemoize | Cache results of functions depending on arguments and kee... | [use-memoize.md](../composables/use-memoize.md) |
| useOffsetPagination | Reactive offset pagination. | [use-offset-pagination.md](../composables/use-offset-pagination.md) |
| usePrevious | Holds the previous value of a ref. | [use-previous.md](../composables/use-previous.md) |
| useStepper | Provides helpers for building a multi-step wizard interface. | [use-stepper.md](../composables/use-stepper.md) |
| useSupported | SSR compatibility | [use-supported.md](../composables/use-supported.md) |
| useThrottleFn | Throttle execution of a function. Especially useful for r... | [use-throttle-fn.md](../composables/use-throttle-fn.md) |
| useTimeoutPoll | Use timeout to poll something. It will trigger callback a... | [use-timeout-poll.md](../composables/use-timeout-poll.md) |
| useToggle | A boolean switcher with utility functions. | [use-toggle.md](../composables/use-toggle.md) |
| useToNumber | Reactively convert a string ref to number. | [use-to-number.md](../composables/use-to-number.md) |
| useToString | Reactively convert a ref to string. | [use-to-string.md](../composables/use-to-string.md) |

## Watch

| Composable | Description | File |
| --- | --- | --- |
| until | Promised one-time watch for changes | [until.md](../composables/until.md) |
| watchArray | Watch for an array with additions and removals. | [watch-array.md](../composables/watch-array.md) |
| watchAtMost | with the number of times triggered. | [watch-at-most.md](../composables/watch-at-most.md) |
| watchDebounced | Debounced watch. The callback will only be invoked after ... | [watch-debounced.md](../composables/watch-debounced.md) |
| watchDeep | Shorthand for watching value with | [watch-deep.md](../composables/watch-deep.md) |
| watchIgnorable | Ignorable watch | [watch-ignorable.md](../composables/watch-ignorable.md) |
| watchImmediate | Shorthand for watching value with | [watch-immediate.md](../composables/watch-immediate.md) |
| watchOnce | Shorthand for watching value with . Once the callback fir... | [watch-once.md](../composables/watch-once.md) |
| watchPausable | Pausable watch | [watch-pausable.md](../composables/watch-pausable.md) |
| watchThrottled | Throttled watch. The callback will be invoked at most onc... | [watch-throttled.md](../composables/watch-throttled.md) |
| watchTriggerable | Watch that can be triggered manually | [watch-triggerable.md](../composables/watch-triggerable.md) |
| watchWithFilter | with additional EventFilter control. | [watch-with-filter.md](../composables/watch-with-filter.md) |
| whenever | Shorthand for watching value to be truthy. | [whenever.md](../composables/whenever.md) |

