import { useState } from "react";
import DomainSelect from "./DomainSelect";

export default function ParentChildrenMapping({ parents, attributes }) {
  const [formData, setFormData] = useState(attributes.initialValues);
  console.log(formData);

  function onChange(e) {
    const { name, value, type } = e.target;
    // if (type === "select-one") {
    //   setFormData((prevState) => {
    //     return {
    //       ...prevState,
    //       ...value,
    //     };
    //   });
    // } else {
    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
    // }
  }
  return (
    <div>
      <form>
        <div className={"flex flex-col w-md gap-0.5 text-md text-slate-600"}>
          <label htmlFor={attributes.parentName}>{attributes.parentName}</label>
          <DomainSelect
            name={attributes.parentName}
            optionsName={attributes.label}
            onChange={onChange}
            options={parents}
            selectTypeName={attributes.parentName}
          />
        </div>
      </form>
    </div>
  );
}
