import { useState } from "react";
import { lui } from "../../../src/components";

export function FormsSample() {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <lui.card>
      <h2>forms</h2>
      <div className="card-content">
        <lui.form
          className="form"
          errors={errors}
          onSubmit={async (event: any) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const value = formData.get("url") as string;
            setLoading(true);
            const response = await submitForm(value);
            const serverErrors = { url: response.error };
            setErrors(serverErrors);
            setLoading(false);
          }}
        >
          <lui.field.root>
            <lui.field.label className="label">URL Validation</lui.field.label>
            <lui.field.control
              type="url"
              required
              placeholder="https://example.com"
              pattern="https?://.*"
              className="value"
            />
            <lui.field.error className="error" />
          </lui.field.root>
          <lui.button type="submit" disabled={loading} focusableWhenDisabled>
            Continue
          </lui.button>
        </lui.form>
      </div>
    </lui.card>
  );
}

async function submitForm(value: string) {
  // Mimic a server response   await new Promise((resolve) => {     setTimeout(resolve, 1000);   });
  try {
    const url = new URL(value);
    if (url.hostname.endsWith("example.com")) {
      return { error: "The example domain is not allowed" };
    }
  } catch {
    return { error: "This is not a valid URL" };
  }
  return { success: true };
}
