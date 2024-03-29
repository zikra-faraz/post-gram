const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-[60vh]">
      <img
        src="/icons/loader.svg"
        alt="loader"
        width={60}
        height={60}
        className="animate-spin"
      />
    </div>
  );
};

export default Loader;
