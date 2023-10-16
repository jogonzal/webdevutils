import * as React from "react";

const DefaultOnSSR = () => <span></span>;

// Disable SSR sendering
class NoSSR extends React.Component<
  { children?: React.ReactNode; onSSR?: React.ReactNode },
  { canRender: boolean }
> {
  constructor(args) {
    super(args);
    this.state = {
      canRender: false,
    };
  }

  componentDidMount() {
    this.setState({ canRender: true });
  }

  render() {
    const { children, onSSR = <DefaultOnSSR /> } = this.props;
    const { canRender } = this.state;

    return canRender ? children : onSSR;
  }
}

export const MyApp = ({ Component, pageProps }) => {
  return (
    <NoSSR>
      <Component {...pageProps} />
    </NoSSR>
  );
};

export default MyApp;
