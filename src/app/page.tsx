import CheckList from "../component/check-list";

export default function Home() {
  return (
    <>
      <div className="w-full max-w-[1200px] p-4 flex flex-col justify-center items-center gap-4">
        <CheckList></CheckList>
      </div>
    </>
  );
}
