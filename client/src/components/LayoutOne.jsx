import { Fragment } from 'react'
import Header from './Header'
import Footer from './Footer'
const LayoutOne = ({ children = <></> }) => {
  return (
    <>
      <Header />
      <main className='bg-background-50 flex min-h-screen flex-col pt-8 pb-15'>
        <div className='mx-auto w-9/10'>
          <Fragment>{children}</Fragment>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default LayoutOne
