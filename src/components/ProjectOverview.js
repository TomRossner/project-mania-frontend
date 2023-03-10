import React, { useEffect } from 'react';
import Line from './common/Line';
import Spinner from './common/Spinner';
import ProjectInfoBar from './ProjectInfoBar';
import ProjectStagesContainer from './ProjectStagesContainer';
import useProject from '../hooks/useProject';
import { useDispatch } from 'react-redux';
import { setProjectMembers } from '../store/project/project.actions';

const ProjectOverview = () => {
    const {currentProject} = useProject();
    const dispatch = useDispatch();

    useEffect(() => {
      if (currentProject) dispatch(setProjectMembers(currentProject.members));
    }, [currentProject])

  return (
    <>
        {currentProject ?
        <div className="project-overview">
            <ProjectInfoBar/>
            <Line/>
            <ProjectStagesContainer/>
        </div>
        : <Spinner/>}
    </>
  )
}

export default ProjectOverview;