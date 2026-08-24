function FieldSample() {
  return (
    <lui.card>
      <h2>field</h2>
      <div className="card-content">
        <lui.field.root>
          <lui.field.label className="label">Email</lui.field.label>
          <lui.field.control
            type="email"
            required
            placeholder="you@example.com"
            className="value"
          />
          <lui.field.description>Nunca la compartimos.</lui.field.description>
          <lui.field.error className="error" />
        </lui.field.root>
      </div>
    </lui.card>
  );
}

render(<FieldSample />);
