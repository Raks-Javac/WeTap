import LoadingState from "./LoadingState";

export default function FullScreenLoader({ label }: { label?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingState label={label} />
    </div>
  );
}
