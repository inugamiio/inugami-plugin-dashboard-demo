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

import io.inugami.api.exceptions.FatalException;

public class MockFromImageFatalException extends FatalException {
    
    // =========================================================================
    // ATTRIBUTES
    // =========================================================================
    private static final long serialVersionUID = 3460636358528132353L;
    
    // =========================================================================
    // CONSTRUCTORS
    // =========================================================================
    public MockFromImageFatalException() {
        super();
    }
    
    public MockFromImageFatalException(final String message, final Object... values) {
        super(message, values);
    }
    
    public MockFromImageFatalException(final String message, final Throwable cause) {
        super(message, cause);
    }
    
    public MockFromImageFatalException(final String message) {
        super(message);
    }
    
    public MockFromImageFatalException(final Throwable cause, final String message, final Object... values) {
        super(cause, message, values);
    }
    
    public MockFromImageFatalException(final Throwable cause) {
        super(cause);
    }
}
