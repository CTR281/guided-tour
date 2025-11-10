# GuidedTour

![demo](/doc/demo.gif)

GuidedTour enables Angular developers to build customizable and responsive guided tours that highlight features of an application page.

It is an <b>Angular library</b> for v20+ <b>Angular applications</b>.

It supports both standalone and `NgModules` architectures through `provideGuidedTour()` and `GuidedTourModule.forRoot()`.

Creating a guided tour is done within an application. It essentially entails two steps:

- Configuring the guided tour: designing each step, tweaking the style globally and/or for each step;
- Interacting with the guided tour: deciding when to launch the guided tour by calling `run()` on `GuidedTourService`.

## Features

- Fully Customizable – Each slide is an Angular component, allowing you to completely change its style and layout from one slide to another.

- Responsive – The tour automatically scrolls to offscreen or fixed elements, fits slides optimally on the screen, and recalculates positioning and flow whenever the window is resized, ensuring highlighted elements remain accurate even if the layout changes (e.g. due to media queries).

- Easy to Configure – Control the tour flow effortlessly using directives, and take advantage of the documented API to override styles or behavior at each step.

## How to use

The first step is to provide the library to your application.

### How to install

`GuidedTourService` is the API of the library. You use it to start the tour. But first, you must provide it to your application.

The `GuidedTourService` is a singleton that lives in the `EnvironmentProviders` of the application. The most straight forward way is to add `provideGuidedTour()` to the `providers` array of your app config, like so:

```typescript
const appConfig: ApplicationConfig = {
  providers: [provideGuidedTour()],
};
```

### How to configure

The tour will be started by calling `run` on the service, like so:

```typescript
tour.run(
  stepConfigs, // GuidedTourStepConfig[]
  globalConfig, // GuidedTourGlobalConfig
);
```

- `stepConfigs` (see [GuidedTourStepConfig](#guidedtourstepconfig)) is the array of steps that make up the tour. Each step is associated with a slide - an Angular Component - and misc. options to customise the tour at each step.
- `globalConfig` (see [GuidedTourGlobalConfig](#guidedtourglobalconfig)) is a set of global options to customise every step of the tour at once. Note that it is possible to define both global and step options; in that case, global options act as default common values for each step, which may be overridden at the step level by the stepConfig.

#### Directives

The library provides a set of Angular directives that allow you to interact with the tour's lifecycle when designing your components.

The list of available directives:

- `guided-tour-next` navigates to the next step;
- `guided-tour-prev` navigates to the previous step in the normal flow. If used on the skip slide, navigates back to the step the user skipped from;
- `guided-tour-skip` navigates to the skip slide;
- `guided-tour-finish` resets the tour and closes the popup.

You can add a directive to a template element; it will activate when the user clicks on the element.
For example, if you want the user to move on to the next step when clicking on a 'Next' button, you could do it like this:

```html
<button guided-tour-next (click)="onClick()">Next</button>
```

#### Customising the guided tour

The tour is made up of 3 components: the <i>popup</i>, the <i>spotlight</i> and the indicator <i>arrow</i>. Each element can be repositioned and restyled, according to the API definition of their respective configs (see [API definition](#api-definition)).

By default, the <i>popup</i> is a white empty dialog box on top of an un-clickable dark backdrop that covers the screen.
Its size may vary from 350x350 px to 450x450 px depending on the content you will be displaying via your custom components. This is only the default dimensions: you can specify any custom range via the `minHeight`, `maxHeight`, `minWidth`, `maxWidth` css properties.
You can also increase the distance between the popup and the spotlight via the `margin` custom config property.
Finally, the popup is scrollable in case the content does not fit.

The <i>spotlight</i> defines the area of the highlighted DOM element. It is optional - a step may not specify an element to be highlighted (typically this is the case for the first step, the last step, and the skip step).
A typical customization of the spotlight consists of adding some padding to the area and even a border or an outline.

The indicator arrow is only displayed when there is an element to highlight. It will always be positioned so that it points to the middle of the highlighted element (unless customized otherwise).
A typical customization consists of editing the size of the arrow.

### API definition

#### GuidedTourStepConfig

```typescript
interface GuidedTourStepConfig {
  /** The CSS selector of the element to highlight. If several elements match, only the first element will be considered. */
  selector?: string;
  /** The Angular component to display in the dialog. */
  stepComponent: {
    component: Type<any>; // any Angular Component
    inputs: Record<string, unknown>; // must match the component's set of @Input properties
  };
  /** If set to true, will scroll to the highlighted element at the start of the step. Defaults to *true*. */
  scroll?: boolean;
  /** The position to place the tour dialog. Defaults to 'CENTER'.
   *
   * Depending on the popup config, the position specified may not be possible; in that case, the tour will resort to
   * any other position that is acceptable.
   *
   * The 'BOTTOM' position is guaranteed to work.
   *
   * Note: position will be ignored if no selector is set.
   * */
  position?:
    | 'TOP'
    | 'TOP_LEFT'
    | 'LEFT'
    | 'BOTTOM_LEFT'
    | 'BOTTOM'
    | 'BOTTOM_RIGHT'
    | 'RIGHT'
    | 'TOP_RIGHT'
    | 'CENTER';
  /** If set to true, the dialog's position will be enforced even if it does not fit.*/
  forcePosition?: boolean;
  spotlightConfig?: {
    /** All values will be added to their respective css property
     * For example: assuming the element's top property is 80px; correctionTop: 10 -> top: 80 + 10
     * */
    corrections: {
      correctionTop: number;
      correctionLeft: number;
      correctionHeight: number;
      correctionWidth: number;
    };
    /**
     * Extra space around highlighted element
     */
    padding: number;
    /**
     * CSS rules to override default element's css
     */
    styleProps: StyleProps;
  };
  popupConfig?: {
    corrections: {
      correctionTop: number;
      correctionLeft: number;
      correctionMargin: number;
    };
    /**
     * Distance between spotlight and popup
     */
    margin: number;
    styleProps: StyleProps;
  };
  arrowConfig?: {
    arrowSize: number;
    styleProps: StyleProps;
  };
}
```

#### GuidedTourGlobalConfig

```typescript
interface GuidedTourGlobalConfig {
  spotlightConfig?: {
    corrections: {
      correctionTop: number;
      correctionLeft: number;
      correctionHeight: number;
      correctionWidth: number;
    };
    padding: number;
    styleProps: StyleProps;
  };
  popupConfig?: {
    corrections: {
      correctionTop: number;
      correctionLeft: number;
      correctionMargin: number;
    };
    margin: number;
    styleProps: StyleProps;
  };
  arrowConfig?: {
    arrowSize: number;
    styleProps: StyleProps;
  };
  /** The Angular component to use as the skip slide. Note: if it is not specified, the last slide will act as the skip slide*/
  skip?: GuidedTourStepConfig;
}
```

### Example

Here's an example of a component which configures and starts a tour.

```typescript
@Component({
  selector: 'app-root',
  imports: [CommonModule],
  template: `
    <button (click)="onClick()">Start the tour</button>
    <div class="div1"><div class="divdiv1"></div></div>
    <div class="div2"></div>
    <div class="div3"></div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  stepsConfig: GuidedTourStepConfig[] = [
    {
      stepComponent: {
        component: Slide01Component,
      },
      popupConfig: {
        styleProps: {
          minHeight: '385px',
          minWidth: '450px',
        },
      },
    },
    {
      selector: 'div:has(> div.divdiv1)',
      position: 'BOTTOM',
      stepComponent: {
        component: Slide02Component,
      },
      popupConfig: {
        styleProps: {
          minHeight: '300px',
          minWidth: '375px',
        },
      },
    },
    {
      selector: '.div2',
      position: 'TOP',
      stepComponent: {
        component: Slide03Component,
      },
      popupConfig: {
        styleProps: {
          minHeight: '325px',
        },
      },
      arrowConfig: {
        styleProps: {
          borderBottomColor: '#E6EFF5',
        },
      },
    },
    {
      selector: '.div3',
      position: 'BOTTOM_LEFT',
      stepComponent: {
        component: Slide04Component,
      },
      spotlightConfig: {
        corrections: {
          correctionTop: 10,
          correctionHeight: -20,
        },
      },
      popupConfig: {
        corrections: {
          correctionTop: -10,
        },
        styleProps: {
          minHeight: '350px',
          minWidth: '450px',
        },
      },
    },
    {
      stepComponent: {
        component: Slide09Component,
      },
    },
  ];
  options: GuidedTourGlobalConfig = {
    skip: { stepComponent: { component: SlideSkipComponent } },
    spotlightConfig: {
      padding: 5,
      styleProps: {
        borderRadius: '4px',
        outline: '5px solid #0045FF',
      },
    },
    popupConfig: {
      corrections: {
        correctionMargin: 10, // spotlight padding + outline
      },
      styleProps: {
        borderRadius: '4px',
        minHeight: '300px',
        maxHeight: '450px',
        minWidth: '350px',
        maxWidth: '450px',
      },
    },
  };

  constructor(public tour: GuidedTourService) {}

  onClick() {
    this.tour.run(this.stepsConfig, this.options);
  }
}
```

Check the application [`guided-tour-test-app`](./projects/guided-tour-test-app/README.md) for a working example.
