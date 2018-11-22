import hammer from 'hammerjs'

const SUPPORTED_HAMMER_GESTURES = [
  'longpress',
  'slide',
  'slidestart',
  'slideend',
  'slideright',
  'slideleft'
];

/**
 * Fake HammerInstance that is used when a Hammer instance is requested when HammerJS has not
 * been loaded on the page.
 */
const noopHammerInstance = {
  on: () => { },
  off: () => { },
};


export class GestureConfig {
  /** List of new event names to add to the gesture support list */

  constructor(_hammerOptions) {
    this._hammerOptions = _hammerOptions
    this.events = SUPPORTED_HAMMER_GESTURES;
    this.overrides = {};
    this.options = {};
  }

  /**
   * Builds Hammer instance manually to add custom recognizers that match the Material Design spec.
   * @param element Element to which to assign the new HammerJS gestures.
   * @returns Newly-created HammerJS instance.
   */
  buildHammer(element) {
    if (!hammer) {
      return noopHammerInstance;
    }

    const mc = new hammer(element, this._hammerOptions || undefined);

    // Default Hammer Recognizers.
    const pan = new hammer.Pan();
    const swipe = new hammer.Swipe();
    const press = new hammer.Press();

    // Notice that a HammerJS recognizer can only depend on one other recognizer once.
    // Otherwise the previous `recognizeWith` will be dropped.
    // TODO: Confirm threshold numbers with Material Design UX Team
    const slide = this._createRecognizer(pan, { event: 'slide', threshold: 0 }, swipe);
    const longpress = this._createRecognizer(press, { event: 'longpress', time: 500 });

    // Overwrite the default `pan` event to use the swipe event.
    pan.recognizeWith(swipe);

    // Since the slide event threshold is set to zero, the slide recognizer can fire and
    // accidentally reset the longpress recognizer. In order to make sure that the two
    // recognizers can run simultaneously but don't affect each other, we allow the slide
    // recognizer to recognize while a longpress is being processed.
    // See: https://github.com/hammerjs/hammer.js/blob/master/src/manager.js#L123-L124
    longpress.recognizeWith(slide);

    // Add customized gestures to Hammer manager
    mc.add([swipe, press, pan, slide, longpress]);

    return mc;
  }

  /** Creates a new recognizer, without affecting the default recognizers of HammerJS */
  _createRecognizer(base, options, ...inheritances) {
    let recognizer = new base.constructor(options);

    inheritances.push(base);
    inheritances.forEach(item => recognizer.recognizeWith(item));

    return recognizer;
  }

}