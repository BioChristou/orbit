/*
 Copyright (C) 2016 Electronic Arts Inc.  All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:

 1.  Redistributions of source code must retain the above copyright
     notice, this list of conditions and the following disclaimer.
 2.  Redistributions in binary form must reproduce the above copyright
     notice, this list of conditions and the following disclaimer in the
     documentation and/or other materials provided with the distribution.
 3.  Neither the name of Electronic Arts, Inc. ("EA") nor the names of
     its contributors may be used to endorse or promote products derived
     from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY ELECTRONIC ARTS AND ITS CONTRIBUTORS "AS IS" AND ANY
 EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL ELECTRONIC ARTS OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

package cloud.orbit.actors.test;

public class TestUtils
{
    private static final char[] HEXES = "0123456789abcdef".toCharArray();

    public static String hexDump(int columns, byte[] raw, int offset, int length)
    {
        int i = offset, j = offset, end = offset + length;

        int x = 0, w = ((length / columns) + 1) * columns;
        final StringBuilder hex = new StringBuilder(w * 4 + columns + 20);
        hex.append("size: ").append(length).append("\r\n");
        for (; x < w; x++)
        {
            if (i < end)
            {
                // while there are chars to read
                final byte ch = raw[i++];
                hex.append(HEXES[(ch & 0xF0) >> 4]).append(HEXES[ch & 0x0F]);
            }
            else
            {
                // complete the rest of the line
                hex.append(' ').append(' ');
            }
            hex.append((x % 8 == 7) ? '|' : ' ');
            if (x % columns == (columns - 1))
            {
                // print char representation of the bytes
                hex.append(' ');
                for (; j < i; j++)
                {
                    final byte ch = raw[j];
                    hex.append(ch >= 32 ? (char) ch : '_');
                }
                hex.append("\r\n");
            }
        }
        return hex.toString();
    }

}
