const LoadingPage = ({ message }: { message?: string }) => {
  return (
    <div className="flex h-screen w-full -translate-y-20 flex-col items-center justify-center">
      {/* <Skeleton className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary" /> */}
      <img src="/loading_spinner.gif" alt="Loading..." className="w-80" />
      <p className="mt-4 text-gray-700">{message}</p>
    </div>
  );
};

export default LoadingPage;
