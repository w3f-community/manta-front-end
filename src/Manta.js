import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function base64ToArray(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState(null);
  // The form values
  const [formState, setFormState] = useState({amount:0, k:null, s:null, cm:null})

  const onChangeAmount = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));
  
  const onChangeK = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: base64ToArray(data.value)}));

  const onChangeS = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: base64ToArray(data.value)}));
  
  const onChangeCm = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: base64ToArray(data.value)}));
  
  const {amount, k, s, cm} = formState;

  return (
    <Grid.Column width={8}>
      <h1> Manta DAP</h1>
      <Form>
          <Form.Field>
          <Input
            fluid
            label='Amount'
            type='number'
            placeholder='amount (u64)'
            state='amount'
            onChange={onChangeAmount}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='k'
            type='text'
            placeholder = "k (base64)"
            state='k'
            onChange={onChangeK}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='s'
            type='text'
            placeholder='s (base 64)'
            state='s'
            onChange={onChangeS}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='commitment'
            type='text'
            placeholder = 'cm (base64)'
            state='cm'
            onChange={onChangeCm}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'mantaDap',
              callable: 'mint',
              inputParams: [amount, k, s, cm],
              paramFields: [true, true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function Manta (props) {
  const { api } = useSubstrate();
  return api.query.mantaDap ? <Main {...props} /> : null;
}
