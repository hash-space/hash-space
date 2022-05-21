import React, { useState, useEffect } from 'react';
import { channels, OnSubscribeModal } from '@epnsproject/frontend-sdk-staging';
import { useEthersAppContext } from 'eth-hooks/context';
import { Button } from '@mui/material';

const CHANNEL_ADDRESS = '0xeA6011Ff0d0D076C40d41EF33BC1D25FF5a52c15';

function EpnsButton() {
  const ethersAppContext = useEthersAppContext();
  const [isSubscribed, setSubscribeStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const onClickHandler = (e) => {
    e.preventDefault();

    if (!isSubscribed) {
      channels.optIn(
        ethersAppContext.signer,
        CHANNEL_ADDRESS,
        ethersAppContext.chainId,
        ethersAppContext.account,
        {
          onSuccess: () => {
            console.log('channel opted in');
            setShowModal(true);
            setSubscribeStatus(true);
          },
        }
      );
    } else {
      channels.optOut(
        ethersAppContext.signer,
        CHANNEL_ADDRESS,
        ethersAppContext.chainId,
        ethersAppContext.account,
        {
          onSuccess: () => {
            console.log('channel opted out');
            setSubscribeStatus(false);
          },
        }
      );
    }
  };

  useEffect(() => {
    if (!ethersAppContext.account) return;

    channels
      .isUserSubscribed(ethersAppContext.account, CHANNEL_ADDRESS)
      .then((status) => {
        setSubscribeStatus(status);
      });
  }, [ethersAppContext.account]);
  const isDisabled = !(
    ethersAppContext.active && ethersAppContext.chainId == 42
  );

  return (
    <div>
      {showModal && <OnSubscribeModal onClose={() => setShowModal(false)} />}
      <Button
        disabled={isDisabled}
        color="secondary"
        variant="outlined"
        onClick={onClickHandler}>
        {isSubscribed ? 'Subscribe' : 'Unsubscribe'}
      </Button>
    </div>
  );
}

export default EpnsButton;
