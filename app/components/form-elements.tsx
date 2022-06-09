export const Label = ({ htmlFor, className = '', ...props }: JSX.IntrinsicElements['label']) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`inline-block my-1 text-md font-medium ${className}`}
      {...props}
    />
  )
}

export const Input = ({ type, name, className = '', ...props }: JSX.IntrinsicElements['input']) => {
  return (
    <input
      type={type}
      name={name}
      id={name}
      className={`px-6 py-4 w-full hover:ring-2 transition duration-75 focus:outline-none focus:ring-2 rounded-md bg-gray-100 ${className}`}
      {...props}
    />
  )
}
