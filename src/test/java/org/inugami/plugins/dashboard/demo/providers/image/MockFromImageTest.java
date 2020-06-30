/* --------------------------------------------------------------------
 *  Inugami  
 * --------------------------------------------------------------------
 * 
 * This program is free software: you can redistribute it and/or modify  
 * it under the terms of the GNU General Public License as published by  
 * the Free Software Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU 
 * General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License 
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
package org.inugami.plugins.dashboard.demo.providers.image;


import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.inugami.api.functionnals.FunctionMustThrow;
import org.inugami.commons.tools.TestUnitResources;
import org.junit.jupiter.api.Test;

public class MockFromImageTest implements FunctionMustThrow, TestUnitResources {
    
    // =========================================================================
    // ResolveTargetName
    // =========================================================================
    @Test
    public void testResolveTargetName() throws Exception {
        final MockFromImage provider = new MockFromImage();
        
        assertThat(provider.resolveTargetName("/META-INF/mock/system/my.image.gif")).isEqualTo("system-my-image");

        mustThrow(() -> provider.resolveTargetName("/system/my.image.gif"));
        
    }
    
    // =========================================================================
    // GETTERS & SETTERS
    // =========================================================================
    @Test
    public void testReadImage() throws Exception {
        
        final MockFromImage provider = new MockFromImage();
        final double[] ref = { 5.0, 4.0, 1.0, 2.0, 3.0 };
        final List<Double> data = provider.readImage("/META-INF/testReadImage.png");
        
        assertEquals(ref.length, data.size());
        for (int i = 0; i < ref.length; i++) {
            assertEquals(ref[i], data.get(i), 0.01);
        }
        
    }
    
}
