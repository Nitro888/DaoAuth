module.exports = {
  'address': '0x668Fadc48337Cb191332aB21fE6e3576E2E45294',
  'abi': [
    {
      'constant': false,
      'inputs': [],
      'name': 'build',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_keySet',
          'type': 'address[3]'
        },
        {
          'name': '_uid',
          'type': 'bytes32'
        }
      ],
      'name': 'create',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_keySet',
          'type': 'address[3]'
        },
        {
          'name': '_uid',
          'type': 'bytes32'
        }
      ],
      'name': 'issue',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'newKey',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_issuer',
          'type': 'address'
        },
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'proxyAdd',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_issuer',
          'type': 'address'
        },
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'proxyRemove',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_user',
          'type': 'address'
        },
        {
          'name': '_msgPack',
          'type': 'bytes'
        }
      ],
      'name': 'register',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'updatePayment',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'constant': false,
      'inputs': [
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'updateVerify',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    },
    {
      'anonymous': false,
      'inputs': [
        {
          'indexed': true,
          'name': '_user',
          'type': 'address'
        },
        {
          'indexed': true,
          'name': '_avatar',
          'type': 'address'
        },
        {
          'indexed': false,
          'name': '_msgPack',
          'type': 'bytes'
        }
      ],
      'name': 'USER',
      'type': 'event'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_uid',
          'type': 'bytes32'
        }
      ],
      'name': 'accountByUID',
      'outputs': [
        {
          'name': '',
          'type': 'address'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'accounts',
      'outputs': [
        {
          'name': '',
          'type': 'uint256[2]'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_account',
          'type': 'address'
        }
      ],
      'name': 'isAccount',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_issuer',
          'type': 'address'
        }
      ],
      'name': 'isIssuer',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_issuer',
          'type': 'address'
        },
        {
          'name': '_account',
          'type': 'address'
        }
      ],
      'name': 'isMember',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_who',
          'type': 'address'
        }
      ],
      'name': 'isMember',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_account',
          'type': 'address'
        },
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'isPayment',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_issuer',
          'type': 'address'
        },
        {
          'name': '_proxy',
          'type': 'address'
        }
      ],
      'name': 'isProxy',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [
        {
          'name': '_account',
          'type': 'address'
        },
        {
          'name': '_key',
          'type': 'address'
        }
      ],
      'name': 'isVerify',
      'outputs': [
        {
          'name': '',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    },
    {
      'constant': true,
      'inputs': [],
      'name': 'members',
      'outputs': [
        {
          'name': '',
          'type': 'uint256'
        }
      ],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }
  ]
}
