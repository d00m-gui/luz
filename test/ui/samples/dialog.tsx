import { lui } from "../../../src/components";
export function DialogSample() {
  return (
    <lui.card className="dialog card">
      <h2>dialog</h2>
      <lui.dialog.root>
        <lui.dialog.trigger className="button">
          View notifications
        </lui.dialog.trigger>
        <lui.dialog.portal>
          <lui.dialog.backdrop className="backdrop" />
          <lui.dialog.popup className="popup">
            <div className="popup-header handle">
              <lui.dialog.close className="button ghost">
                &times;
              </lui.dialog.close>
              <lui.dialog.title className="title">
                Notifications
              </lui.dialog.title>
            </div>
            <div className="popup-content">
              <lui.dialog.description className="description">
                Aliquam lobortis vitae nibh nec rhoncus. Morbi mattis neque eget
                efficitur feugiat. Vivamus porta nunc a erat mattis, mattis
                feugiat turpis pretium. Quisque sed tristique felis.
              </lui.dialog.description>
            </div>
            <div className="popup-actions">
              <lui.dialog.close className="button reset">
                Cancel
              </lui.dialog.close>
              <lui.button>Apply</lui.button>
            </div>
          </lui.dialog.popup>
        </lui.dialog.portal>
      </lui.dialog.root>
    </lui.card>
  );
}
