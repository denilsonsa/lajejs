#!/usr/bin/env python
# -*- coding: utf-8 -*-
# vi:ts=4 sw=4 et

import numpy
import sys

def main():
    s = numpy.logspace(0.25, 2.5)
    f = sys.stdout

    for a in s:
        for b in s:
            for q in [0.01, 0.1, 1, 10]:
                f.write('{0:.2f},{1:.2f},{2:.3f}\r\n'.format(a,b,q))

    f.write('0,0,0\r\n')


if __name__ == "__main__":
    main()
