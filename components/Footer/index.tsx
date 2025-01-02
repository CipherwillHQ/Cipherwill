import TopRow from "./TopRow";
import BottomRow from "./BottomRow";
import SecurityInfo from "./SecurityInfo";

export default function Footer() {
  return (
    <div className="w-full mt-20 bg-slate-50 text-black/75 text-sm">  
      <footer className="p-4 max-w-7xl mx-auto">
        <TopRow />
        <hr className="my-8 border-black/20" />
        <SecurityInfo />
        <hr className="my-8 border-black/20" />
        <BottomRow />
      </footer>
    </div>
  );
}
