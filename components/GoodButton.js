import React from "react";

const GoodButton = props => {
  return (
    <div>
      <button>{...props.children}</button>
    </div>
  )
}

export default GoodButton;