import { Listbox, Transition } from '@headlessui/react'
import { Link, useLocation } from '@remix-run/react'
// import { CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import * as React from 'react'

interface SelectProps {
  id: number
  name: string
  url: string
}

interface Props {
  options: SelectProps[]
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SelectBox({ options }: Props[]) {
  const [selected, setSelected] = React.useState(options[0])
  const location = useLocation()
  React.useEffect(() => {
    const selectedOptions = options.find((option: SelectProps) =>
      option.url.endsWith(location.search),
    )
    setSelected(selectedOptions)
  }, [location.search])
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Listbox.Label className='block text-sm font-medium text-gray-700'>Filter</Listbox.Label>
          <div className='mt-1 relative'>
            <Listbox.Button className='relative bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 sm:text-sm'>
              <p>{selected?.name}</p>
            </Listbox.Button>

            <Transition
              show={open}
              as={React.Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 mt-1 bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm'>
                {options.map((option: SelectProps) => (
                  <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-sky-500' : 'text-gray-900',
                        'cursor-default select-none relative',
                      )
                    }
                    value={option}
                  >
                    {({ selected }) => (
                      <Link
                        to={option.url}
                        className={classNames(
                          selected ? 'font-semibold bg-sky-500 text-white' : 'font-normal',
                          'truncate block w-full px-4 py-2 hover:bg-slate-100 hover:text-slate-800',
                        )}
                      >
                        {option.name}
                      </Link>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  )
}
