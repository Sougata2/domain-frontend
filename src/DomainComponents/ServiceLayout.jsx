import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Outlet,
  useParams,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";
import { IoIosArrowForward } from "react-icons/io";
import {
  fetchStages,
  nextStage,
  prevStage,
  setCurrentStage,
} from "@/state/stageSlice";
import { Button } from "@/components/ui/button";

function ServiceLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { referenceNumber } = useParams();
  const { stages, currentStage } = useSelector((state) => state.formStage);

  useEffect(() => {
    if (stages.length === 0) dispatch(fetchStages(referenceNumber));
  }, [dispatch, referenceNumber, stages]);

  useEffect(() => {
    if (stages.length) {
      const stageRoute = location.pathname.split("/")[1];
      stages.forEach((stage, index) => {
        const stageUrl = stage.menu.url;
        if (stageUrl === stageRoute) {
          dispatch(setCurrentStage(index));
        }
      });
    }
  }, [dispatch, location, stages]);

  function handlePrevStage() {
    dispatch(prevStage());
    const prevStageUrl = stages[currentStage - 1].menu.url;
    navigate(`/${prevStageUrl}/${referenceNumber}`);
  }

  function handleNextStage() {
    dispatch(nextStage());
    const nextStageUrl = stages[currentStage + 1].menu.url;
    navigate(`/${nextStageUrl}/${referenceNumber}`);
  }

  return (
    <div className="flex flex-col gap-2.5 items-center">
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
      <div
        className={`w-3xl mb-3 flex justify-${
          currentStage <= 0 ? "end" : "between"
        }`}
      >
        {currentStage > 0 && (
          <Button variant="outline" onClick={handlePrevStage}>
            Previous
          </Button>
        )}
        {currentStage < stages.length - 1 && (
          <Button onClick={handleNextStage}>Next</Button>
        )}
      </div>
    </div>
  );
}

export default ServiceLayout;
