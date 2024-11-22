import ExecutorPermissions from "../../components/executor/ExecutorPermissions";

export default function Executor() {
  return (
    <div className="w-full p-4">
      <h1 className="text-xl font-semibold py-3">Execution Dashboard</h1>
      <ExecutorPermissions/>
    </div>
  );
}
