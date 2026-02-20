interface Props {
  response: string;
}

export default function ResponseCard({ response }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm whitespace-pre-wrap">
      {response}
    </div>
  );
}