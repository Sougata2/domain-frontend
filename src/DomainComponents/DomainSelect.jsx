export default function DomainSelect({ name, onChange, options, selectName }) {
  return (
    <select
      className={"py-1 px-1 border rounded"}
      name={name}
      onChange={(e) => {
        const { value: id, name, type } = e.target;
        const value = options.filter((op) => op.id == id);
        onChange({ target: { name, value: value[0], type } });
      }}
    >
      <option value="" className={"text-sm text-slate-500"}>
        Select {selectName}
      </option>
      {options.map((op) => {
        return (
          <option value={op.id} key={op.id} className={"text-left"}>
            {op[name]}
          </option>
        );
      })}
    </select>
  );
}
