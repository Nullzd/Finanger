import React from 'react';
import Input from '../Forms/Imput';
import Button from '../Forms/Button';

const LoginPasswordLost = () => {
  
  return (
    <section>
      <h1 className="title">Esqueceu a senha</h1>
      < br />
      <form>
      <Input label="E-mail" type="email" name="email"  />
            <Button>Enviar Email</Button>
          
        </form>
      

    </section>
  );
};

export default LoginPasswordLost;
