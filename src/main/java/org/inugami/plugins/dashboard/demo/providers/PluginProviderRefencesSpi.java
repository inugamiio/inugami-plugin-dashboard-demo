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
package org.inugami.plugins.dashboard.demo.providers;

import java.util.Map;

import org.inugami.api.spi.PropertiesProducerSpi;
import org.inugami.plugins.dashboard.demo.providers.image.MockFromImage;

public class PluginProviderRefencesSpi implements PropertiesProducerSpi {
    @Override
    public Map<String, String> produce() {
        //@formatter:off
        return producerFromClasses(
                   //providers
                   MockFromImage.class
                 
        );
        //@formatter:on
    }
}
