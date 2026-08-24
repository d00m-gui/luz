function SwitchSample() {
  const [checked, setChecked] = useState(true);
  return (
    <lui.card>
      <h2>switch</h2>
      <div className="card-content">
        <lui.switch.root checked={checked} onCheckedChange={setChecked}>
          <lui.switch.thumb />
        </lui.switch.root>
      </div>
    </lui.card>
  );
}

render(<SwitchSample />);
