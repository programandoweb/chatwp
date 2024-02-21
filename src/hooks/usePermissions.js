import React from 'react';
import StateContext from '../helpers/ContextState';
import NotFound    from '../components/NotFound/BK403';
let render  = false
const usePermissions    =   (prefijo, option, components ) => {
  const context         =   React.useContext(StateContext);
  if (( !context.user || 
        !context.user.permissions)||
        ( context.user&&
          context.user.permissions&&
          !context.user.permissions[prefijo])
          ) {
    return null
  }
  if (option) {
    const result  = context.user.permissions[prefijo].find(search=>search===option)
    if (!result) {
      render=<NotFound/>
    }else {
      render=<components.component 
                      fullScreenModal={components.fullScreenModal||false}
                      skipAdd={components.skipAdd||false}
                      href={components.href}
                      customAdd={components.customAdd} 
                      upload={components.upload} 
                      download={components.download} 
                      skipSearch={components.skipSearch} 
                      subFixed={components.subFixed} 
                      td={components.td} 
                      permissions={context.user.permissions[prefijo]} 
                      create={components.create}
              />
    }
  }
  return  {
            open:context.user.permissions[prefijo],
            render:()=>{return render}
          }
};

export default usePermissions;
