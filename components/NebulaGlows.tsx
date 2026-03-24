export default function NebulaGlows() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" data-testid="nebula-container">
      <div className="absolute -right-20 top-[15%] h-[350px] w-[350px] rounded-full bg-[rgba(186,117,23,0.055)] blur-[100px]" />
      <div className="absolute -left-16 top-[45%] h-[280px] w-[280px] rounded-full bg-[rgba(186,117,23,0.04)] blur-[100px]" />
      <div className="absolute bottom-[20%] right-[10%] h-[250px] w-[250px] rounded-full bg-[rgba(239,159,39,0.03)] blur-[100px]" />
      <div className="absolute bottom-[35%] left-[5%] h-[200px] w-[200px] rounded-full bg-[rgba(186,117,23,0.025)] blur-[100px]" />
    </div>
  );
}
