import { ParseableStepConfig, StyleProps } from '../guided-tour';

export interface ParserResult {
  styleProps: StyleProps;
}

export abstract class StepConfigParser {
  protected constructor(
    public stepConfig: ParseableStepConfig,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    ..._: any[]
  ) {}

  abstract parse(): ParserResult;
}
