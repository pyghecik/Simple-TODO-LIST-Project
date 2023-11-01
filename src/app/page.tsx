import NewTodoForm from "../../components/NewTodoForm";

export default function Home() {
  return (
    <div className="flex justify-center">
      <div className="mt-[2.3%] w-[31.5rem] text-center">
        <NewTodoForm />
      </div>
    </div>
  );
}
