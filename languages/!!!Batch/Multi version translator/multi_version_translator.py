import argparse


lowerbet = ('abcdefghijklmnopqrstuvwxyz', '')
middlebet13 = ('& ?!\/.:0123456789|', '')
middlebet15 = ('& ?!%/.:0123456789=+-<>@*', '-')
upperbet = ('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '+')

version_bets = {
    '1.3': [(lowerbet[0] + middlebet13[0], '')],
    '1.5': [(lowerbet[0] + middlebet15[0], ''), upperbet],
    '2.0': [lowerbet, middlebet15, upperbet]
}


def translate(s, version='2.0'):
    for bet, symbol in version_bets[version]:
        for i, c in enumerate(bet):
            s = s.replace('?' + '!' * (i + 1) + symbol + '?', c)
    return s


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('source')
    parser.add_argument('--output', '-o', default='runscript.bat')
    parser.add_argument('--std', '-s',
        choices=version_bets.keys(), default='2.0'
    )
    args = parser.parse_args()

    with open(args.source) as f:
        s = f.read()

    s = translate(s, args.std)

    with open(args.output, 'w') as f:
        f.write(s)


if __name__ == '__main__':
    main()
