import { IoMdArrowDropright } from "react-icons/io";

function PreviewDataCell({ label, value }) {
  return (
    <div className="flex items-center">
      <div>{label}</div>
      <div className="pt-[3px]">
        <IoMdArrowDropright size={22} className="text-violet-500" />
      </div>
      <div className="font-extralight">{value}</div>
    </div>
  );
}

export default PreviewDataCell;
