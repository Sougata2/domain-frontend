import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useParams, NavLink } from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import { fetchStages } from "@/state/stageSlice";

function ServiceLayout() {
  const dispatch = useDispatch();
  const { referenceNumber } = useParams();
  const { stages } = useSelector((state) => state.formStage);

  useEffect(() => {
    if (stages.length === 0) dispatch(fetchStages(referenceNumber));
  }, [dispatch, referenceNumber, stages]);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex justify-center items-center">
        {stages && (
          <div className="flex items-start gap-2 flex-wrap w-3xl">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-2">
                <NavLink
                  to={`/${stage.menu.url}/${referenceNumber}`}
                  className={({ isActive }) =>
                    `text-[15px] capitalize ${
                      isActive
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`
                  }
                >
                  {stage.menu.name}
                </NavLink>

                {index < stages.length - 1 && (
                  <IoIosArrowForward
                    className="text-muted-foreground pt-[1px]"
                    size={"15px"}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default ServiceLayout;
