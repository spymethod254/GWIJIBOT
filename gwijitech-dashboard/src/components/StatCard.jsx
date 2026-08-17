export default function StatCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <h3 className="text-gray-400 text-sm">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  )
}
