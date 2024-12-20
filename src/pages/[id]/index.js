import { useAppContext } from '@/context/CartContext'
import React from 'react'

export async function getServerSideProps(context) {
    const { params } = context

    return {
        props: { id:params.id }
    }
}

export default function Description(props) {
  const { id: path } = props
  const { state: { prices } = [], dispatch } = useAppContext()
  const product = prices.filter(val => val.id === path.replace('/', ''))[0]

  function addToBasket(prod) {
    return () => {
      dispatch({
        type: 'add_product',
        value: prod.id
      })
    }
  }

  return (
    <div>
      <button onClick={addToBasket(product)}>ADD TO BASKET</button>
    </div>
  )
}
