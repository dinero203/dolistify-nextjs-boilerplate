"use client";
import React, { useCallback, useEffect, useState } from "react";
import FullSavedTaskPreview from "../../styles/fullSavedTaskPreview.module.css";
import { getTaskDetailsForPreview } from "../backend_component/TaskBackend";

interface savedTaskDataType {
   title: string;
   subtasks: Array<{ id: number; description: string }>;
   status: Array<{ id: number; completed: boolean | null; missed: boolean | null }>;
}

export default function ShowSavedTaskPreview({
   dashboardBtn,
   taskId,
}: {
   taskId: string;
   dashboardBtn: string;
}) {
   const [savedTask, setSavedTask] = useState<savedTaskDataType>();
   const [taskType, setTaskType] = useState("")

   function dashboardBtnFormat(dashboardType: "personal" | "repeated" | "time_bound" | "work") {
      switch (dashboardType) {
         case "personal":
            return "Personal Task";
            break;
         case "time_bound":
            return "Time bound Task";
            break;
         case "repeated":
            return "Repeated Task";
            break;
         case "work":
            return "Work Task";
            break;
      }
   }


   const fetchTaskDetailsPreview = useCallback(() => {
      async function savedTaskQuery() {
         try {
            if (taskId !== null && dashboardBtn !== "") {
               const dashboardBtnType = dashboardBtnFormat(dashboardBtn as "personal" | "repeated" | "time_bound" | "work")
               setTaskType(dashboardBtnType)

               const result = await getTaskDetailsForPreview(taskId, dashboardBtn);
               if (!result) {
                  return;
               }
               setSavedTask(result); // Save the processed task
            } else {
               return ;
            }
         } catch  {
            return ;
         }
      }

      savedTaskQuery();
   }, [taskId, dashboardBtn]);

   useEffect(() => {
      fetchTaskDetailsPreview()
   }, [fetchTaskDetailsPreview])


   return (
      <>
         {
            savedTask ?
               (
                  <div key={taskId} className={FullSavedTaskPreview.container}>
                     {/* Task Title */}
                     <div className={FullSavedTaskPreview.title}>
                        <div>

                           Task title : {savedTask.title}
                        </div>
                     </div>

                     {/* Header Section */}
                     <div className={FullSavedTaskPreview.header}>
                        <div className={FullSavedTaskPreview.dashboard}>
                           {taskType}
                        </div>

                        <div className={FullSavedTaskPreview.editing_items}>
                           Task Count : {savedTask.status.length}
                        </div>

                        <div className={FullSavedTaskPreview.complete_indicator}>
                           Completed : {savedTask.status.filter(task => task.completed).length}
                        </div>

                        <div className={FullSavedTaskPreview.missed_indicator}>
                           Missed : {savedTask.status.filter(task => task.missed).length}
                        </div>

                        <div className={FullSavedTaskPreview.active_indicator}>
                           Active : {savedTask.status.length -
                              (savedTask.status.filter(task => task.completed).length +
                                 savedTask.status.filter(task => task.missed).length)}
                        </div>
                     </div>

                     {/* Task Table */}
                     <div className={FullSavedTaskPreview.table_container}>
                        <div className={FullSavedTaskPreview.task_table}>
                           {savedTask.status && savedTask.subtasks.map((eachTask, index) => {
                              const taskStatus = savedTask.status[index];

                              return (
                                 <div
                                    key={eachTask.id}
                                    className={`
                                       ${FullSavedTaskPreview.content}
                                       ${taskStatus.completed ? FullSavedTaskPreview.completeIndicator : ''}
                                       ${taskStatus.missed ? FullSavedTaskPreview.missedIndicator : ''}
                                    `}
                                 >
                                    <div className={FullSavedTaskPreview.mark}>
                                       <div className={FullSavedTaskPreview.taskCount}>{index + 1}</div>
                                    </div>
                                    <div className={FullSavedTaskPreview.user_text}>
                                       <div className={FullSavedTaskPreview.user_input}>
                                          {eachTask.description}
                                       </div>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className={FullSavedTaskPreview.loader_container}>
                     <div className={FullSavedTaskPreview.loader}></div>
                  </div>
               )
         }
      </>
   );
}
