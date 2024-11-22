import TopRow from "./TopRow";
import BottomRow from "./BottomRow";
import SecurityInfo from "./SecurityInfo";

export default function Footer() {
  return (
    <div className="w-full mt-20 bg-black text-white">  
      <footer className="px-4 py-8 max-w-7xl mx-auto">
        <TopRow />
        <hr className="my-8 border-white/10" />
        <SecurityInfo />
        <hr className="my-8 border-white/10" />
        <BottomRow />
      </footer>
    </div>
  );
}
