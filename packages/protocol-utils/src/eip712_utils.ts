import { hexUtils, NULL_ADDRESS } from '@0x/utils';

export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}

export type EIP712_STRUCT_ABI = Array<{ type: string; name: string }>;

export const EIP712_DOMAIN_PARAMETERS = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
];

const EXCHANGE_PROXY_EIP712_DOMAIN_DEFAULT = {
    chainId: 1,
    verifyingContract: NULL_ADDRESS,
    name: 'EvryFinance',
    version: '1.0.0',
};

const EXCHANGE_PROXY_DOMAIN_TYPEHASH = hexUtils.hash(
    hexUtils.toHex(
        Buffer.from(
            [
                'EIP712Domain(',
                ['string name', 'string version', 'uint256 chainId', 'address verifyingContract'].join(','),
                ')',
            ].join(''),
        ),
    ),
);

/**
 * Create an exchange proxy EIP712 domain.
 */
export function createExchangeProxyEIP712Domain(chainId?: number, verifyingContract?: string, name?: string): EIP712Domain {
    return {
        ...EXCHANGE_PROXY_EIP712_DOMAIN_DEFAULT,
        ...(chainId ? { chainId } : {}),
        ...(verifyingContract ? { verifyingContract } : {}),
        ...(name ? { name } : {}),
    };
}

/**
 * Get the hash of the exchange proxy EIP712 domain.
 */
export function getExchangeProxyEIP712DomainHash(chainId?: number, verifyingContract?: string, name?: string): string {
    const domain = createExchangeProxyEIP712Domain(chainId, verifyingContract, name);
    return hexUtils.hash(
        hexUtils.concat(
            EXCHANGE_PROXY_DOMAIN_TYPEHASH,
            hexUtils.hash(hexUtils.toHex(Buffer.from(domain.name))),
            hexUtils.hash(hexUtils.toHex(Buffer.from(domain.version))),
            hexUtils.leftPad(domain.chainId),
            hexUtils.leftPad(domain.verifyingContract),
        ),
    );
}

/**
 * Compute a complete EIP712 hash given a struct hash.
 */
export function getExchangeProxyEIP712Hash(structHash: string, chainId?: number, verifyingContract?: string, name?: string): string {
    return hexUtils.hash(
        hexUtils.concat('0x1901', getExchangeProxyEIP712DomainHash(chainId, verifyingContract, name), structHash),
    );
}

/**
 * Compute the type hash of an EIP712 struct given its ABI.
 */
export function getTypeHash(structName: string, abi: EIP712_STRUCT_ABI): string {
    return hexUtils.hash(
        hexUtils.toHex(Buffer.from([`${structName}(`, abi.map(a => `${a.type} ${a.name}`).join(','), ')'].join(''))),
    );
}
