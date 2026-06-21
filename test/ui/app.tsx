import { TabsSample } from "./samples/tabs";
import { MenusSample } from "./samples/menus";
import { ButtonsSample } from "./samples/buttons";
import { AvatarsSample } from "./samples/avatars";
// import { ColorsSample } from "./samples/colors";
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
import "./styles.css";
import { DialogSample } from "./samples/dialog";

export function App() {
  return (
    <>
      <main>
        <h6 className="title">
          <span>:::</span> luz{" "}
          <small>
            <span>&lt;</span>luz.components <span>/&gt;</span>
          </small>
        </h6>
        <p className="description">
          <i className="nf nf-fa-store" /> Showcase of built-in <b>HTML</b> and{" "}
          <b>React Components</b>
          <small>
            /w batteries <i className="nf nf-md-battery_heart" /> included.
          </small>
        </p>
        <hr />
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
    </>
  );
}

export default App;
