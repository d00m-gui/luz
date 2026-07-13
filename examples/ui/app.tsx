import { TabsSample } from "./samples/tabs";
import { MenusSample } from "./samples/menus";
import { ButtonsSample } from "./samples/buttons";
import { AvatarsSample } from "./samples/avatars";
import { MenubarSample } from "./samples/menubar";
import { MeterSample } from "./samples/meter";
import { FormsSample } from "./samples/forms";
import { ToggleSample } from "./samples/toggle";
import { ToastSample } from "./samples/toast";
import { SwitchSample } from "./samples/switch";
import { InputsSample } from "./samples/inputs";
import { HeadingsSample } from "./samples/headings";
import { ElementsSample } from "./samples/elements";
import { InlineSample } from "./samples/inline";
import { BlockquoteSample } from "./samples/blockquote";
import { GroupSample } from "./samples/groups";
import { TablesSample } from "./samples/tables";
import { LoadingSample } from "./samples/loading";
import { DialogSample } from "./samples/dialog";
import { luz } from "../../src/luz";
import { config } from "./luz.config";
import { LuzReact } from "../../src/react";

export function App() {
  const {
    tokens: { colors, sizes, typography },
  } = luz(config);

  return (
    <LuzReact config={config}>
      <main>
        <h6 className="title">
          <span>&lt;</span>luz.<i>components</i> <span>/&gt;</span>
        </h6>
        <hr />
        <div className="beforeafter">
          <div className="term config">
            <textarea defaultValue={JSON.stringify(config, null, 2)} />
          </div>
          <div className="term config">
            <textarea
              defaultValue={JSON.stringify(
                { colors, sizes, typography },
                null,
                2,
              )}
            />
            {/*<ReactJson src={} theme="monokai" />*/}
          </div>
        </div>
        <div className="settings">
          <div className="typography">
            {typography &&
              Object.entries(typography).map(([key, value], idx) => {
                return (
                  <p key={idx}>
                    <span>{key}:</span>
                    <b>{value as string}</b>
                  </p>
                );
              })}
          </div>
          <div className="colors">
            {colors &&
              Object.entries(colors).map(([color], idx: number) => {
                if (
                  color === "primary" ||
                  color === "secondary" ||
                  color === "neutral"
                )
                  return;
                return (
                  <div
                    key={idx}
                    className="color"
                    data-tooltip={color}
                    style={{
                      backgroundColor: `var(--${color})`,
                      height: "5px",
                    }}
                  ></div>
                );
              })}
          </div>
          <div className="sizes">
            {Object.entries(sizes).map(
              ([name, value]: [name: string, value: any], idx) => {
                const size = value.startsWith("clamp")
                  ? parseFloat(value.split(",").at(-1).replace("rem)", "")) * 10
                  : parseFloat(value.split("rem")) * 10;
                return (
                  <div key={idx}>
                    <small>--{name}:</small>
                    {typeof size === "number" && <code>{size}px</code>}
                  </div>
                );
              },
            )}
          </div>
        </div>
        <div className="cards">
          <AvatarsSample />
          <BlockquoteSample />
          <ButtonsSample />
          {/*<ColorsSample colors={tokens.colors} />*/}
          <ElementsSample />
          <FormsSample />
          <GroupSample />
          <HeadingsSample />
          <InlineSample />
          <InputsSample />
          <LoadingSample />
          <MenubarSample />
          <MenusSample />
          <TablesSample />
          <MeterSample />
          <SwitchSample />
          <TabsSample />
          <ToastSample />
          <ToggleSample />
          <DialogSample />
        </div>
      </main>
      <style precedence="high">{ColorsSampleStyle}</style>
    </LuzReact>
  );
}
const ColorsSampleStyle = `
  .beforeafter {
    display: grid;
    grid-template-columns: 1fr 3fr;
    container-type: inline-size;
    gap: var(--size-12);
    margin: 2ch auto;
    textarea {
      width: 100%;
      max-width: none;
      resize: none;
      font-size: var(--size-12);
      min-height: 20vh;
    }
  }
  .settings {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0 0 var(--spacing) 0;
  }
  .sizes {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1ch;
    container-type: inline-size;
    p small {
      display: block;
      font-size: var(--size-13);
    }
  }
  .typography {
    container-type: inline-size;
    p {
      margin-bottom: 2ch;
    }
    span {
      color: var(--secondary-400);
    }
    b {
      display: block;
      transform-origin: 0% 50%;
      transform: scale(1.8);
    }
  }
  .colors {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    padding: 0 2ch;
    .color {
      min-height: 3rem;
    }
  }
`;
export default App;
