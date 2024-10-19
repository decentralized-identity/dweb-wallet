import CircleProgress from "./CircleProgress";

const Loader:React.FC<{ message: string }> = ({ message }) => {

  return <div className="flex flex-col items-center justify-center min-h-[100vh]">
      <CircleProgress size={'large'} />
      <h6 className="mt-6">
        {message}
      </h6>
    </div>}

export default Loader;