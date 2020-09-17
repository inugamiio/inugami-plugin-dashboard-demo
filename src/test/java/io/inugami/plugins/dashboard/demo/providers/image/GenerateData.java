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
package io.inugami.plugins.dashboard.demo.providers.image;

import io.inugami.api.loggers.Loggers;
import io.inugami.api.models.JsonBuilder;
import io.inugami.api.models.data.DataGeneratorUtils;
import org.junit.jupiter.api.Test;

import java.util.Calendar;

public class GenerateData {

    // =========================================================================
    // METHODS
    // =========================================================================
    @Test
    public void test() {
        final JsonBuilder json = new JsonBuilder();
        final Calendar    now  = Calendar.getInstance();
        now.set(Calendar.SECOND, 0);
        now.set(Calendar.MILLISECOND, 0);

        json.openList();
        json.openObject().addLine();
        json.addField("current").valueQuot("current");
        json.addSeparator();
        json.addField("datapoints");
        json.openList();

        for (int i = 10; i > 0; i--) {
            now.add(Calendar.MINUTE, -1);
            json.openList();
            json.write(DataGeneratorUtils.getRandomBetween(32000, 10000));
            json.addSeparator();
            json.write((int) (now.getTimeInMillis() / 1000));
            json.closeList();
            if (i > 1) {
                json.addSeparator();
            }
            json.addLine();
        }
        json.closeList();
        json.closeObject();
        json.closeList();
        Loggers.DEBUG.info(json.toString());
    }
}
