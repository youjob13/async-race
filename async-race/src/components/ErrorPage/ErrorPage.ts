import BaseControl from '../../shared/templates/BaseControl/BaseControl';
import { ErrorPageClasses, Tag } from '../../shared/variables';

const ERROR_CONTENT = '404 not found';
const errorPagePropsToBaseControl = {
  tagName: Tag.DIV,
  classes: [ErrorPageClasses.WRAPPER],
};
const titleProps = {
  tagName: Tag.P,
  classes: [ErrorPageClasses.CONTENT],
  text: ERROR_CONTENT,
};

class ErrorPage extends BaseControl<HTMLElement> {
  constructor() {
    super(errorPagePropsToBaseControl);

    this.render();
  }

  private render(): void {
    const title = new BaseControl(titleProps);
    this.node.append(title.node);
  }
}

export default ErrorPage;
